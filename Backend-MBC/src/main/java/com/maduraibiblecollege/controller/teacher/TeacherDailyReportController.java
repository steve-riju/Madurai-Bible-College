package com.maduraibiblecollege.controller.teacher;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maduraibiblecollege.dto.TeacherDailyReportDto;
import com.maduraibiblecollege.service.TeacherDailyReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/reports")
@RequiredArgsConstructor
public class TeacherDailyReportController {

    private final TeacherDailyReportService service;

    @PostMapping
    public ResponseEntity<TeacherDailyReportDto> submitReport(@RequestBody TeacherDailyReportDto dto) {
        return ResponseEntity.ok(service.submitReport(dto));
    }

    @GetMapping
    public ResponseEntity<List<TeacherDailyReportDto>> getAllReports() {
        return ResponseEntity.ok(service.getAllReports());
    }

    @GetMapping("/teacher/{id}")
    public ResponseEntity<List<TeacherDailyReportDto>> getReportsByTeacher(@PathVariable Long id) {
        return ResponseEntity.ok(service.getReportsByTeacher(id));
    }
}