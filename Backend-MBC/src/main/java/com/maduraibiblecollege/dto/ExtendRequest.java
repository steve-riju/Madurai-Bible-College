package com.maduraibiblecollege.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ExtendRequest {
    private Long assignmentId;
    private LocalDateTime newEndDate;
    private Long studentId; // optional: null means batch-wide
    private String reason;
}

