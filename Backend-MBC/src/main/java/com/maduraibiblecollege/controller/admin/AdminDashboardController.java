package com.maduraibiblecollege.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maduraibiblecollege.dto.AdminDashboardDto;
import com.maduraibiblecollege.service.AdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    public AdminDashboardController(AdminDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        AdminDashboardDto dto = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(dto);
    }
}

