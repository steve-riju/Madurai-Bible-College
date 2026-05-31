package com.maduraibiblecollege.controller.admin;

import com.maduraibiblecollege.dto.*;
import com.maduraibiblecollege.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProfileController {

    private final ProfileService profileService;

    @GetMapping("/profiles")
    public ResponseEntity<PageResponse<ProfileCardDto>> getProfiles(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String program,
            @PageableDefault(size = 12, sort = "id", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return ResponseEntity.ok(
                PageResponse.from(profileService.getProfileCards(role, name, academicYear, semester, batch, program, pageable))
        );
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentProfileDto> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getStudentProfileById(id));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<StudentProfileDto> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateStudentRequest request) {
        return ResponseEntity.ok(profileService.adminUpdateStudent(id, request));
    }

    @GetMapping("/teachers/{id}")
    public ResponseEntity<TeacherProfileDto> getTeacher(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getTeacherProfileById(id));
    }

    @PutMapping("/teachers/{id}")
    public ResponseEntity<TeacherProfileDto> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateTeacherRequest request) {
        return ResponseEntity.ok(profileService.adminUpdateTeacher(id, request));
    }
}
