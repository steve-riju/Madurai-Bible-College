package com.maduraibiblecollege.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maduraibiblecollege.dto.BatchCourseRequest;
import com.maduraibiblecollege.dto.BatchCreateRequest;
import com.maduraibiblecollege.dto.BatchDto;
import com.maduraibiblecollege.dto.BatchEnrollmentRequest;
import com.maduraibiblecollege.dto.CreateBatchWithEnrollmentsRequest;
import com.maduraibiblecollege.entity.Batch;
import com.maduraibiblecollege.entity.CourseAssigned;
import com.maduraibiblecollege.entity.Enrollment;
import com.maduraibiblecollege.entity.Role;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.BatchRepository;
import com.maduraibiblecollege.repository.CourseAssignedRepository;
import com.maduraibiblecollege.repository.EnrollmentRepository;
import com.maduraibiblecollege.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BatchServiceImpl implements BatchService {

	private final BatchRepository batchRepository;
	private final UserRepository userRepository;
	private final CourseAssignedRepository courseAssignedRepository;
	private final EnrollmentRepository enrollmentRepository;

	@Override
	public BatchDto createBatch(BatchCreateRequest request) {
		Batch batch = new Batch();
		batch.setName(request.getName());
		batch.setSemesterId(request.getSemesterId());
		Batch saved = batchRepository.save(batch);
		return toDto(saved);
	}

	@Override
	public BatchDto addStudents(Long batchId, BatchEnrollmentRequest request) {
		Batch batch = batchRepository.findById(batchId)
				.orElseThrow(() -> new RuntimeException("Batch not found"));

		List<User> students = userRepository.findAllById(request.getStudentIds());
		batch.getStudents().addAll(students);

		// auto-create enrollments for all batch courses
		for (User student : students) {
			for (CourseAssigned ca : batch.getCourses()) {
				Enrollment e = new Enrollment();
				e.setStudent(student);
				e.setCourseAssigned(ca);
				enrollmentRepository.save(e);
			}
		}

		return toDto(batchRepository.save(batch));
	}

	@Override
	public BatchDto addCourses(Long batchId, BatchCourseRequest request) {
		Batch batch = batchRepository.findById(batchId)
				.orElseThrow(() -> new RuntimeException("Batch not found"));

		List<CourseAssigned> courses = courseAssignedRepository.findAllById(request.getCourseAssignedIds());
		batch.getCourses().addAll(courses);

		// auto-enroll all existing students in new courses
		for (User student : batch.getStudents()) {
			for (CourseAssigned ca : courses) {
				Enrollment e = new Enrollment();
				e.setStudent(student);
				e.setCourseAssigned(ca);
				enrollmentRepository.save(e);
			}
		}

		return toDto(batchRepository.save(batch));
	}

	@Override
	public BatchDto getBatch(Long id) {
		Batch batch = batchRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Batch not found"));
		return toDto(batch);
	}

	@Override
	public List<BatchDto> searchBatches(String keyword) {
		return batchRepository.findByNameContainingIgnoreCase(keyword).stream()
				.map(this::toDto)
				.collect(Collectors.toList());
	}

	private BatchDto toDto(Batch batch) {
		return BatchDto.builder()
				.id(batch.getId())
				.name(batch.getName())
				.semesterId(batch.getSemesterId())
				.courses(batch.getCourses().stream()
						.map(c -> c.getCourse().getName())
						.collect(Collectors.toList()))
				.students(batch.getStudents().stream()
						.map(User::getUsername)
						.collect(Collectors.toList()))
				.build();
	}

	@Override
	@Transactional
	public BatchDto createBatchWithEnrollments(CreateBatchWithEnrollmentsRequest request) {
		Batch batch;

		// 1) If batchId provided -> fetch
		if (request.getBatchId() != null) {
			batch = batchRepository.findById(request.getBatchId())
					.orElseThrow(() -> new RuntimeException("Batch not found"));
		} else {
			// 2) Try to find by name + semesterId (treat as unique constraint)
			if (request.getName() != null && request.getSemesterId() != null) {
				batch = batchRepository.findByNameAndSemesterId(request.getName(), request.getSemesterId())
						.orElse(null);
			} else {
				batch = null;
			}

			if (batch == null) {
				// Create new batch
				batch = new Batch();
				batch.setName(request.getName());
				batch.setSemesterId(request.getSemesterId());
			} else {
				// Existing batch found, update fields (if needed)
				batch.setName(request.getName());
				batch.setSemesterId(request.getSemesterId());
			}
		}

		// ✅ Save once here so we have a managed entity (effectively final)
		Batch savedBatch = batchRepository.save(batch);
		Long batchId = savedBatch.getId();

		// 3) Resolve CourseAssigned and add to batch (avoid duplicates)
		if (request.getCourseAssignedIds() != null && !request.getCourseAssignedIds().isEmpty()) {
			final Batch batchRef = savedBatch; // ✅ make effectively final reference
			List<CourseAssigned> courses = courseAssignedRepository.findAllById(request.getCourseAssignedIds());
			List<CourseAssigned> toAddCourses = courses.stream()
					.filter(ca -> batchRef.getCourses().stream()
							.noneMatch(existing -> existing.getId().equals(ca.getId())))
					.toList();
			savedBatch.getCourses().addAll(toAddCourses);
		}


		// 4) Resolve students, validate role, add to batch (avoid duplicates)
		List<User> studentsToProcess = (request.getStudentIds() != null && !request.getStudentIds().isEmpty())
				? userRepository.findAllById(request.getStudentIds()).stream()
						.filter(u -> u.getRole() == Role.STUDENT) // only allow STUDENT role
						.toList()
						: List.of();

		if (!studentsToProcess.isEmpty()) {
			final Batch batchRef = savedBatch; // ✅ effectively final reference
			List<User> toAddStudents = studentsToProcess.stream()
					.filter(s -> batchRef.getStudents().stream()
							.noneMatch(existing -> existing.getId().equals(s.getId())))
					.toList();
			savedBatch.getStudents().addAll(toAddStudents);
		}


		// ✅ Save again after adding relationships
		savedBatch = batchRepository.save(savedBatch);

		// 6) Create Enrollment rows for (student x courseAssigned), skipping duplicates
		List<CourseAssigned> batchCourses = savedBatch.getCourses();

		if (!studentsToProcess.isEmpty() && !batchCourses.isEmpty()) {
			for (User student : studentsToProcess) {
				for (CourseAssigned courseAssigned : batchCourses) {
					boolean alreadyEnrolled = enrollmentRepository.findByStudent(student).stream()
							.anyMatch(e -> e.getCourseAssigned().getId().equals(courseAssigned.getId())
									&& e.getBatch().getId().equals(batchId));

					if (!alreadyEnrolled) {
						Enrollment e = new Enrollment();
						e.setStudent(student);
						e.setCourseAssigned(courseAssigned);
						e.setBatch(savedBatch); // ✅ ensure batch is linked
						enrollmentRepository.save(e);
					}
				}
			}
		}

		return toDto(savedBatch);
	}





}
