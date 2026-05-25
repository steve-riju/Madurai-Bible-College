package com.maduraibiblecollege.dto;

import com.maduraibiblecollege.entity.leave.LeaveType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveRequestRequest {

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotBlank
    @Size(max = 1000)
    private String reason;

    @NotNull
    private LeaveType leaveType;
}
