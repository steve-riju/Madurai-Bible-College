package com.maduraibiblecollege.service;

import com.maduraibiblecollege.dto.BatchEnrollmentRequest;
import com.maduraibiblecollege.dto.EnrollmentDto;
import com.maduraibiblecollege.dto.EnrollmentRequest;
import com.maduraibiblecollege.entity.Batch;
import com.maduraibiblecollege.entity.CourseAssigned;
import com.maduraibiblecollege.entity.Enrollment;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.BatchRepository;
import com.maduraibiblecollege.repository.CourseAssignedRepository;
import com.maduraibiblecollege.repository.EnrollmentRepository;
import com.maduraibiblecollege.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseAssignedRepository courseAssignedRepository;
    private final BatchRepository batchRepository;

    @Override
    public Enrollment enrollStudent(EnrollmentRequest request) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        CourseAssigned courseAssigned = courseAssignedRepository.findById(request.getCourseAssignedId())
                .orElseThrow(() -> new RuntimeException("Course assignment not found"));

        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        boolean alreadyEnrolled = enrollmentRepository.findByStudent(student).stream()
                .anyMatch(e -> e.getCourseAssigned().getId().equals(courseAssigned.getId())
                        && e.getBatch().getId().equals(batch.getId()));

        if (alreadyEnrolled) {
            throw new RuntimeException("Student already enrolled in this course for this batch");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourseAssigned(courseAssigned);
        enrollment.setBatch(batch);

        // Add student to batch if not already
        if (!batch.getStudents().contains(student)) {
            batch.getStudents().add(student);
            batchRepository.save(batch);
        }

        return enrollmentRepository.save(enrollment);
    }

@Override
public List<Enrollment> enrollBatch(BatchEnrollmentRequest request) {
    Batch batch = batchRepository.findById(request.getBatchId())
            .orElseThrow(() -> new RuntimeException("Batch not found"));

    List<User> students = userRepository.findAllById(request.getStudentIds());
    List<CourseAssigned> courses = courseAssignedRepository.findAllById(request.getCourseAssignedIds());

    List<Enrollment> savedEnrollments = new ArrayList<>();

    for (User student : students) {
        for (CourseAssigned course : courses) {
            boolean alreadyEnrolled = enrollmentRepository.findByStudent(student).stream()
                    .anyMatch(e -> e.getCourseAssigned().getId().equals(course.getId())
                            && e.getBatch().getId().equals(batch.getId()));

            if (!alreadyEnrolled) {
                Enrollment e = new Enrollment();
                e.setStudent(student);
                e.setCourseAssigned(course);
                e.setBatch(batch);
                savedEnrollments.add(enrollmentRepository.save(e));
            }
        }
    }

    return savedEnrollments;
}

        @Override
public List<EnrollmentDto> getEnrollmentsByCourse(Long courseAssignedId) {
    CourseAssigned courseAssigned = courseAssignedRepository.findById(courseAssignedId)
            .orElseThrow(() -> new RuntimeException("Course assignment not found"));

    return enrollmentRepository.findByCourseAssigned(courseAssigned)
            .stream()
            .map(e -> {
                String semesterName = (e.getCourseAssigned() != null && e.getCourseAssigned().getSemester() != null)
                        ? e.getCourseAssigned().getSemester().getName()
                        : (e.getBatch() != null ? e.getBatch().getSemesterId() : null);

                return new EnrollmentDto(
                        e.getId(),
                        new EnrollmentDto.StudentDto(e.getStudent().getId(), e.getStudent().getName()),
                        new EnrollmentDto.BatchDto(e.getBatch().getId(), e.getBatch().getName(), semesterName), // ✅ fixed
                        new EnrollmentDto.CourseDto(
                                e.getCourseAssigned().getCourse().getId(),
                                e.getCourseAssigned().getCourse().getName()
                        )
                );
            })
            .collect(Collectors.toList());
}



    @Override
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentRepository.findAll()
                .stream()
                .map(e -> {
                    // determine semester display name
                    String semesterName = null;
                    if (e.getCourseAssigned() != null && e.getCourseAssigned().getSemester() != null) {
                        semesterName = e.getCourseAssigned().getSemester().getName();
                    } else if (e.getBatch() != null && e.getBatch().getSemesterId() != null) {
                        semesterName = e.getBatch().getSemesterId(); // fallback
                    }

                    return new EnrollmentDto(
                            e.getId(),
                            new EnrollmentDto.StudentDto(e.getStudent().getId(), e.getStudent().getName()),
                            new EnrollmentDto.BatchDto(e.getBatch().getId(), e.getBatch().getName(), semesterName),
                            new EnrollmentDto.CourseDto(e.getCourseAssigned().getCourse().getId(), e.getCourseAssigned().getCourse().getName())
                    );
                })
                .collect(Collectors.toList());
    }
    
    
    @Override
    @Transactional
    public void removeEnrollment(Long enrollmentId) {
        if (!enrollmentRepository.existsById(enrollmentId)) {
            throw new RuntimeException("Enrollment not found");
        }
        enrollmentRepository.deleteById(enrollmentId);
        enrollmentRepository.flush(); // make sure changes are sent to DB immediately
    }


}
