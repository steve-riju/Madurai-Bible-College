package com.maduraibiblecollege.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.maduraibiblecollege.dto.CourseAssignmentDto;
import com.maduraibiblecollege.dto.CourseDto;
import com.maduraibiblecollege.dto.SemesterDto;
import com.maduraibiblecollege.entity.Course;
import com.maduraibiblecollege.entity.CourseAssigned;
import com.maduraibiblecollege.entity.Role;
import com.maduraibiblecollege.entity.Semester;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.CourseAssignedRepository;
import com.maduraibiblecollege.repository.CourseRepository;
import com.maduraibiblecollege.repository.SemesterRepository;
import com.maduraibiblecollege.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

	private final CourseRepository courseRepo;
	private final SemesterRepository semesterRepo;
	private final CourseAssignedRepository assignedRepo;
	private final UserRepository userRepo;

	@Override
	public CourseDto createCourse(CourseDto dto) {
		Course course = new Course(null, dto.getCode(), dto.getName(), dto.getCredits(),true);// true means private boolean active = true; Added for dashboard
		course = courseRepo.save(course);
		return new CourseDto(course.getId(), course.getCode(), course.getName(), course.getCredits());
	}

	@Override
	public List<CourseDto> getAllCourses() {
		return courseRepo.findAll()
				.stream()
				.map(c -> new CourseDto(c.getId(), c.getCode(), c.getName(), c.getCredits()))
				.toList();
	}

	@Override
	public CourseDto updateCourse(Long id, CourseDto dto) {
		Course course = courseRepo.findById(id).orElseThrow();
		course.setCode(dto.getCode());
		course.setName(dto.getName());
		course.setCredits(dto.getCredits());
		course = courseRepo.save(course);
		return new CourseDto(course.getId(), course.getCode(), course.getName(), course.getCredits());
	}


	@Override
	public SemesterDto createSemester(SemesterDto dto) {
		Semester sem = new Semester(null, dto.getName(), dto.getStartDate(), dto.getEndDate());
		sem = semesterRepo.save(sem);
		return new SemesterDto(sem.getId(), sem.getName(), sem.getStartDate(), sem.getEndDate());
	}

	@Override
	public List<SemesterDto> getAllSemesters() {
		return semesterRepo.findAll()
				.stream()
				.map(s -> new SemesterDto(s.getId(), s.getName(), s.getStartDate(), s.getEndDate()))
				.toList();
	}

	@Override
	public CourseAssignmentDto assignTeacher(CourseAssignmentDto dto) {
		Course course = courseRepo.findById(dto.getCourseId()).orElseThrow();
		Semester semester = semesterRepo.findById(dto.getSemesterId()).orElseThrow();
		User teacher = userRepo.findById(dto.getTeacherId()).orElseThrow();

		if (!teacher.getRole().equals(Role.TEACHER)) {
			throw new RuntimeException("User is not a teacher!");
		}

		CourseAssigned assigned = new CourseAssigned(null, course, semester, teacher);
		assigned = assignedRepo.save(assigned);

		return new CourseAssignmentDto(
				assigned.getId(),
				course.getId(),
				semester.getId(),
				teacher.getId(),
				teacher.getUsername()
				);
	}


	@Override
	public List<CourseAssignmentDto> getAssignments() {
		return assignedRepo.findAll()
				.stream()
				.map(a -> new CourseAssignmentDto(
						a.getId(),
						a.getCourse().getId(),
						a.getSemester().getId(),
						a.getTeacher().getId(),
						a.getTeacher().getUsername()
						))
				.toList();
	}

	@Override
	public void deleteCourse(Long id) {
		try {
			courseRepo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new IllegalStateException("Course cannot be deleted because it is assigned to a semester or teacher.");
		}
	}

	@Override
	public void deleteSemester(Long id) {
		try {
			semesterRepo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new IllegalStateException("Semester cannot be deleted because it has assigned courses/teachers.");
		}
	}

	@Override
	public void deleteAssignment(Long id) {
		try {
			assignedRepo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new IllegalStateException("Assignment cannot be deleted because it is linked to active references.");
		}
	}

	@Override
	public void unassignTeacher(Long id) {
		try {
			assignedRepo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new IllegalStateException("Teacher cannot be unassigned because of existing dependencies.");
		}
	}



}

