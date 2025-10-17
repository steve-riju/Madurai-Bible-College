package com.maduraibiblecollege.dto;

import java.time.LocalDate;
import java.time.LocalTime;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDailyReportDto {

    private Long id;
    private Long teacherId;
    private String teacherName;
    private LocalDate date;
    private String batchName;
    private String courseName;
    private String semester;
    private String lessonCovered;
    private LocalTime startTime;
    private LocalTime endTime;
    private String assignmentsGiven;
    private String additionalNotes;
    private LocalDate createdAt;
}
