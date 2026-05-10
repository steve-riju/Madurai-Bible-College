package com.maduraibiblecollege.dto;

import com.maduraibiblecollege.entity.AdmissionSubmissionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdmissionSubmissionStatusRequest {
    @NotNull(message = "Submission status is required")
    private AdmissionSubmissionStatus status;
}
