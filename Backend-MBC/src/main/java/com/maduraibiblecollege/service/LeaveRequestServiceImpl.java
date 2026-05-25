package com.maduraibiblecollege.service;

import com.maduraibiblecollege.dto.LeaveRequestDto;
import com.maduraibiblecollege.dto.LeaveRequestRequest;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.entity.leave.LeaveRequest;
import com.maduraibiblecollege.entity.leave.LeaveStatus;
import com.maduraibiblecollege.entity.leave.LeaveType;
import com.maduraibiblecollege.exception.BusinessException;
import com.maduraibiblecollege.exception.ResourceNotFoundException;
import com.maduraibiblecollege.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    @Override
    public LeaveRequestDto applyLeave(LeaveRequestRequest request, User student) {
        validateLeaveRequest(request);

        List<LeaveRequest> overlaps = leaveRequestRepository.findOverlappingLeaves(
                student.getId(),
                request.getStartDate(),
                request.getEndDate(),
                List.of(LeaveStatus.PENDING, LeaveStatus.APPROVED)
        );

        if (!overlaps.isEmpty()) {
            throw new BusinessException("Leave request overlaps with an existing pending or approved leave.");
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setStudent(student);
        leaveRequest.setStartDate(request.getStartDate());
        leaveRequest.setEndDate(request.getEndDate());
        leaveRequest.setReason(request.getReason().trim());
        leaveRequest.setLeaveType(request.getLeaveType());
        leaveRequest.setStatus(LeaveStatus.PENDING);

        return toDto(leaveRequestRepository.save(leaveRequest));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getLeavesByStudent(Long studentId) {
        return leaveRequestRepository.findByStudentId(studentId).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getAllLeaves(LeaveStatus status) {
        List<LeaveRequest> leaves = status != null
                ? leaveRequestRepository.findByStatus(status)
                : leaveRequestRepository.findAll();

        return leaves.stream().map(this::toDto).toList();
    }

    @Override
    public LeaveRequestDto approveLeave(Long id, String remarks) {
        LeaveRequest leaveRequest = getLeaveRequest(id);
        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setAdminRemarks(trimToNull(remarks));
        return toDto(leaveRequestRepository.save(leaveRequest));
    }

    @Override
    public LeaveRequestDto rejectLeave(Long id, String remarks) {
        LeaveRequest leaveRequest = getLeaveRequest(id);
        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setAdminRemarks(trimToNull(remarks));
        return toDto(leaveRequestRepository.save(leaveRequest));
    }

    private LeaveRequest getLeaveRequest(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request", id));
    }

    private void validateLeaveRequest(LeaveRequestRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BusinessException("End date cannot be before start date.");
        }

        if (request.getLeaveType() == LeaveType.NORMAL
                && request.getStartDate().isBefore(LocalDate.now().plusDays(7))) {
            throw new BusinessException("Normal leave must be applied at least 7 days before the start date.");
        }

        if (request.getLeaveType() == LeaveType.EMERGENCY && request.getReason().trim().isEmpty()) {
            throw new BusinessException("Reason is required for emergency leave.");
        }
    }

    private LeaveRequestDto toDto(LeaveRequest leaveRequest) {
        User student = leaveRequest.getStudent();
        return LeaveRequestDto.builder()
                .id(leaveRequest.getId())
                .studentId(student != null ? student.getId() : null)
                .studentName(student != null ? getStudentDisplayName(student) : null)
                .startDate(leaveRequest.getStartDate())
                .endDate(leaveRequest.getEndDate())
                .reason(leaveRequest.getReason())
                .leaveType(leaveRequest.getLeaveType())
                .status(leaveRequest.getStatus())
                .appliedDate(leaveRequest.getAppliedDate())
                .adminRemarks(leaveRequest.getAdminRemarks())
                .build();
    }

    private String getStudentDisplayName(User student) {
        return student.getName() != null && !student.getName().isBlank()
                ? student.getName()
                : student.getUsername();
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}
