package com.maduraibiblecollege.service;

import com.maduraibiblecollege.dto.LeaveRequestDto;
import com.maduraibiblecollege.dto.LeaveRequestRequest;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.entity.leave.LeaveRequest;
import com.maduraibiblecollege.entity.leave.LeaveStatus;
import com.maduraibiblecollege.entity.leave.LeaveType;
import com.maduraibiblecollege.exception.BusinessException;
import com.maduraibiblecollege.exception.ResourceNotFoundException;
import com.maduraibiblecollege.entity.Role;
import com.maduraibiblecollege.repository.UserRepository;
import com.maduraibiblecollege.repository.LeaveRequestRepository;
import com.maduraibiblecollege.config.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

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

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        LeaveRequestDto dto = toDto(saved);
        List<String> adminEmails = userRepository.findByRole(Role.ADMIN).stream()
                .map(User::getEmail)
                .filter(email -> email != null && !email.isBlank())
                .toList();
        emailService.sendNewLeaveRequestNotification(adminEmails, dto);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LeaveRequestDto> getLeavesByStudent(Long studentId, Pageable pageable) {
        return leaveRequestRepository.findByStudentId(studentId, pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LeaveRequestDto> getAllLeaves(LeaveStatus status, Pageable pageable) {
        Page<LeaveRequest> leaves = status != null
                ? leaveRequestRepository.findByStatus(status, pageable)
                : leaveRequestRepository.findAll(pageable);

        return leaves.map(this::toDto);
    }

    @Override
    public LeaveRequestDto approveLeave(Long id, String remarks) {
        LeaveRequest leaveRequest = getLeaveRequest(id);
        validatePendingStatus(leaveRequest);
        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setAdminRemarks(trimToNull(remarks));
        LeaveRequestDto dto = toDto(leaveRequestRepository.save(leaveRequest));
        emailService.sendLeaveStatusNotification(leaveRequest.getStudent().getEmail(), dto);
        return dto;
    }

    @Override
    public LeaveRequestDto rejectLeave(Long id, String remarks) {
        LeaveRequest leaveRequest = getLeaveRequest(id);
        validatePendingStatus(leaveRequest);
        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setAdminRemarks(trimToNull(remarks));
        LeaveRequestDto dto = toDto(leaveRequestRepository.save(leaveRequest));
        emailService.sendLeaveStatusNotification(leaveRequest.getStudent().getEmail(), dto);
        return dto;
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

    private void validatePendingStatus(LeaveRequest leaveRequest) {
        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BusinessException("Only pending leave requests can be approved or rejected.");
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
