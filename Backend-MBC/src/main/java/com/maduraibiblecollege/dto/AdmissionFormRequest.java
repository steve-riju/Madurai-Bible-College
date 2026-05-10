package com.maduraibiblecollege.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdmissionFormRequest {
    @NotBlank(message = "Form title is required")
    @Size(max = 150, message = "Form title must be 150 characters or fewer")
    private String title;

    @Size(max = 1000, message = "Description must be 1000 characters or fewer")
    private String description;

    @Size(max = 120, message = "Slug must be 120 characters or fewer")
    private String slug;

    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDateTime deadline;

    private Boolean active;

    private List<AdmissionFormFieldDto> fields;
}
