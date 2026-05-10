package com.maduraibiblecollege.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdmissionFormStatusRequest {
    @NotNull(message = "Active status is required")
    private Boolean active;
}
