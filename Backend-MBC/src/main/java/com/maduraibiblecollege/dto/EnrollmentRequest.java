package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequest {
    private Long studentId;
    private Long courseAssignedId;
    private Long batchId;
}
