package com.maduraibiblecollege.dto;

import com.maduraibiblecollege.entity.assignmnets.SubmissionStatus;

import lombok.Data;

@Data
public class GradeRequest {
    private Long submissionId;
    private Integer marksObtained;
    private String remarks;
    private SubmissionStatus status; // GRADED or REJECTED
}

