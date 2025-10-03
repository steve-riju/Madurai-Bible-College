package com.maduraibiblecollege.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.maduraibiblecollege.entity.assignmnets.SubmissionStatus;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSubmissionDto {
    private Long id;
    private Long assignmentId;
    private Long studentId;
    private String studentName;

    private String textAnswer;
    private LocalDateTime submittedAt;
    private SubmissionStatus status;

    private Integer marksObtained;
    private String teacherRemarks;

    private Integer attemptNumber;

    private List<String> attachmentUrls;
}
