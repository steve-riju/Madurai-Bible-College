package com.maduraibiblecollege.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class AdmissionSubmissionRequest {
    @NotNull(message = "Form id is required")
    private Long formId;

    @NotEmpty(message = "Application answers are required")
    private Map<String, String> answers;
}
