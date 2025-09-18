package com.maduraibiblecollege.dto;

import java.time.Instant;

import com.maduraibiblecollege.entity.assignmnets.AssignmentStatus;

import lombok.Data;

@Data
public class AssignmentRequest {
    private String title;
    private String description;
    private Long batchId;
    private Instant startDate;
    private Instant endDate;
    private Integer maxMarks;
    private AssignmentStatus status; // DRAFT or PUBLISHED
}

