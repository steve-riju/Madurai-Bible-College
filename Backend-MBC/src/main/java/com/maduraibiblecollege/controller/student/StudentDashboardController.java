package com.maduraibiblecollege.controller.student;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.maduraibiblecollege.dto.StudentDashboardDto;
import com.maduraibiblecollege.service.StudentDashboardService;

@RestController
@RequestMapping("/api/student/dashboard")
@RequiredArgsConstructor
public class StudentDashboardController {

    private final StudentDashboardService studentDashboardService;

    @GetMapping
    public ResponseEntity<StudentDashboardDto> getDashboard(Authentication auth) {
        String username = auth.getName();
        System.out.println("+++++++++++++++value in dto: "+studentDashboardService.getDashboardData(username));
        return ResponseEntity.ok(studentDashboardService.getDashboardData(username));
    }
}
