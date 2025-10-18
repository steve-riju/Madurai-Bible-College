package com.maduraibiblecollege.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeacherBatchSummaryDto {
    private Long id;
    private String name;
    private String semesterName;
    private int totalStudents;
    private LocalDate semesterStartDate; 
    private LocalDate semesterEndDate;
    private boolean isCurrentSemester;


}

