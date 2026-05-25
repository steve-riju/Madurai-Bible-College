package com.maduraibiblecollege.controller.admin;

import com.maduraibiblecollege.dto.LeaveActionRequest;
import com.maduraibiblecollege.dto.LeaveRequestDto;
import com.maduraibiblecollege.entity.leave.LeaveStatus;
import com.maduraibiblecollege.service.LeaveRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/leaves")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminLeaveController {

    private final LeaveRequestService leaveRequestService;

    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> getLeaves(@RequestParam(required = false) LeaveStatus status) {
        return ResponseEntity.ok(leaveRequestService.getAllLeaves(status));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveRequestDto> approveLeave(
            @PathVariable Long id,
            @Valid @RequestBody(required = false) LeaveActionRequest request
    ) {
        return ResponseEntity.ok(leaveRequestService.approveLeave(id, request != null ? request.getRemarks() : null));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveRequestDto> rejectLeave(
            @PathVariable Long id,
            @Valid @RequestBody(required = false) LeaveActionRequest request
    ) {
        return ResponseEntity.ok(leaveRequestService.rejectLeave(id, request != null ? request.getRemarks() : null));
    }
}
