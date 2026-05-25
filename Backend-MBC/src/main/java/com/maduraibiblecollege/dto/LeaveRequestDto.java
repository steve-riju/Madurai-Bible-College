package com.maduraibiblecollege.dto;

import com.maduraibiblecollege.entity.leave.LeaveStatus;
import com.maduraibiblecollege.entity.leave.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveType leaveType;
    private LeaveStatus status;
    private LocalDateTime appliedDate;
    private String adminRemarks;
}
