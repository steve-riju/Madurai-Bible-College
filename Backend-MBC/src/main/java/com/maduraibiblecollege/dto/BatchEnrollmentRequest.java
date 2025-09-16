package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchEnrollmentRequest {
    private Long batchId;
    private List<Long> courseAssignedIds; 
    private List<Long> studentIds;
}
