package com.maduraibiblecollege.controller.admin;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maduraibiblecollege.dto.CourseAssignmentDto;
import com.maduraibiblecollege.dto.CourseDto;
import com.maduraibiblecollege.dto.SemesterDto;
import com.maduraibiblecollege.service.CourseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/courses")
@RequiredArgsConstructor
public class AdminCourseController {

    private final CourseService courseService;

    // COURSE
    @PostMapping
    public CourseDto createCourse(@Valid @RequestBody CourseDto dto) {
        return courseService.createCourse(dto);
    }

    @GetMapping
    public List<CourseDto> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PutMapping("/{id}")
    public CourseDto updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDto dto) {
        return courseService.updateCourse(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }

    // SEMESTER
    @PostMapping("/semesters")
    public SemesterDto createSemester(@Valid @RequestBody SemesterDto dto) {
        return courseService.createSemester(dto);
    }

    @GetMapping("/semesters")
    public List<SemesterDto> getAllSemesters() {
        return courseService.getAllSemesters();
    }

    @DeleteMapping("/semesters/{id}")
    public void deleteSemester(@PathVariable Long id) {
        courseService.deleteSemester(id);
    }

    // ASSIGN
    @PostMapping("/assign")
    public CourseAssignmentDto assignTeacher(@Valid @RequestBody CourseAssignmentDto dto) {
        return courseService.assignTeacher(dto);
    }

    @GetMapping("/assignments")
    public List<CourseAssignmentDto> getAssignments() {
        return courseService.getAssignments();
    }

    @DeleteMapping("/assignments/{id}")
    public void unassignTeacher(@PathVariable Long id) {
        courseService.unassignTeacher(id);
    }
}
