package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherReportAllocationDto {
    private Long batchId;
    private String batchName;
    private Long courseAssignedId;
    private Long courseId;
    private String courseName;
    private Long semesterId;
    private String semesterName;
}
