package com.maduraibiblecollege.controller.admin;

import com.maduraibiblecollege.dto.SemesterDto;
import com.maduraibiblecollege.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/semesters")
@RequiredArgsConstructor
public class AdminSemesterController {

    private final CourseService courseService; // CourseService already had semester methods

    @GetMapping
    public ResponseEntity<List<SemesterDto>> getAll() {
        return ResponseEntity.ok(courseService.getAllSemesters());
    }
}
