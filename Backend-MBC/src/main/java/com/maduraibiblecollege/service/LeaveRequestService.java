package com.maduraibiblecollege.service;

import com.maduraibiblecollege.dto.LeaveRequestDto;
import com.maduraibiblecollege.dto.LeaveRequestRequest;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.entity.leave.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LeaveRequestService {
    LeaveRequestDto applyLeave(LeaveRequestRequest request, User student);
    Page<LeaveRequestDto> getLeavesByStudent(Long studentId, Pageable pageable);
    Page<LeaveRequestDto> getAllLeaves(LeaveStatus status, Pageable pageable);
    LeaveRequestDto approveLeave(Long id, String remarks);
    LeaveRequestDto rejectLeave(Long id, String remarks);
}
