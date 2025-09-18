package com.maduraibiblecollege.service;

import java.util.List;

import com.maduraibiblecollege.dto.CourseAssignmentDto;
import com.maduraibiblecollege.dto.CourseDto;
import com.maduraibiblecollege.dto.SemesterDto;

public interface CourseService {
    CourseDto createCourse(CourseDto dto);
    List<CourseDto> getAllCourses();
    CourseDto updateCourse(Long id, CourseDto dto);
    void deleteCourse(Long id);

    SemesterDto createSemester(SemesterDto dto);
    List<SemesterDto> getAllSemesters();

    CourseAssignmentDto assignTeacher(CourseAssignmentDto dto);
    List<CourseAssignmentDto> getAssignments();
	void deleteSemester(Long id);
	void deleteAssignment(Long id);
	void unassignTeacher(Long id);
	
	List<CourseDto> getCoursesByTeacherUsername(String username);


}

