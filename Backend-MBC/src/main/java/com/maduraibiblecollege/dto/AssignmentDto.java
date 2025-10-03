package com.maduraibiblecollege.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;
    private boolean published;

    private Long batchId;
    private String batchName;

    private Long teacherId;
    private String teacherName;

    private Integer maxMarks;

    private List<String> attachmentUrls; // teacher resources

    private boolean submitted; // whether student has submitted
    private AssignmentSubmissionDto submission; // details if submitted
}
