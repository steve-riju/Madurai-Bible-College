package com.maduraibiblecollege.service;

import com.maduraibiblecollege.dto.LeaveRequestDto;
import com.maduraibiblecollege.dto.LeaveRequestRequest;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.entity.leave.LeaveStatus;

import java.util.List;

public interface LeaveRequestService {
    LeaveRequestDto applyLeave(LeaveRequestRequest request, User student);
    List<LeaveRequestDto> getLeavesByStudent(Long studentId);
    List<LeaveRequestDto> getAllLeaves(LeaveStatus status);
    LeaveRequestDto approveLeave(Long id, String remarks);
    LeaveRequestDto rejectLeave(Long id, String remarks);
}
