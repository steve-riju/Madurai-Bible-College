package com.maduraibiblecollege.controller.student;

import com.maduraibiblecollege.dto.LeaveRequestDto;
import com.maduraibiblecollege.dto.LeaveRequestRequest;
import com.maduraibiblecollege.dto.PageResponse;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.service.LeaveRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/student/leaves", "/api/leaves"})
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentLeaveController {

    private final LeaveRequestService leaveRequestService;

    @PostMapping
    public ResponseEntity<LeaveRequestDto> applyLeaveLegacy(
            @Valid @RequestBody LeaveRequestRequest request,
            @AuthenticationPrincipal User student
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveRequestService.applyLeave(request, student));
    }

    @PostMapping("/apply")
    public ResponseEntity<LeaveRequestDto> applyLeave(
            @Valid @RequestBody LeaveRequestRequest request,
            @AuthenticationPrincipal User student
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveRequestService.applyLeave(request, student));
    }

    @GetMapping
    public ResponseEntity<PageResponse<LeaveRequestDto>> getMyLeavesLegacy(
            @AuthenticationPrincipal User student,
            @PageableDefault(size = 10, sort = "appliedDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(PageResponse.from(leaveRequestService.getLeavesByStudent(student.getId(), pageable)));
    }

    @GetMapping("/my-leaves")
    public ResponseEntity<PageResponse<LeaveRequestDto>> getMyLeaves(
            @AuthenticationPrincipal User student,
            @PageableDefault(size = 10, sort = "appliedDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(PageResponse.from(leaveRequestService.getLeavesByStudent(student.getId(), pageable)));
    }
}
