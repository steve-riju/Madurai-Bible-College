package com.maduraibiblecollege.controller.teacher;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.maduraibiblecollege.dto.TeacherDashboardDto;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.UserRepository;
import com.maduraibiblecollege.service.TeacherDashboardService;

import java.security.Principal;

@RestController
@RequestMapping("/api/teacher/dashboard")
@RequiredArgsConstructor
public class TeacherDashboardController {

    private final TeacherDashboardService dashboardService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<TeacherDashboardDto> getDashboardData(Principal principal) {
        User teacher = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Teacher not found"));
        return ResponseEntity.ok(dashboardService.getDashboardData(teacher.getId()));
    }
}
