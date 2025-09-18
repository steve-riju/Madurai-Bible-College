package com.maduraibiblecollege.dto;

import java.time.Instant;

import lombok.Data;

@Data
public class ExtendRequest {
    private Long assignmentId;
    private Instant newEndDate;
    private Long studentId; // optional: null means batch-wide
    private String reason;
}

