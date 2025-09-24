package com.maduraibiblecollege.dto;

import java.time.LocalDateTime;

import com.maduraibiblecollege.entity.assignmnets.AssignmentStatus;

import lombok.Data;

@Data
public class AssignmentRequest {
    private String title;
    private String description;
    private Long batchId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxMarks;
    private AssignmentStatus status; // DRAFT or PUBLISHED
}

