package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//CourseAssignmentDto.java
import jakarta.validation.constraints.NotNull;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CourseAssignmentDto {
 private Long id;

 @NotNull(message = "Course is required")
 private Long courseId;

 @NotNull(message = "Semester is required")
 private Long semesterId;

 @NotNull(message = "Teacher is required")
 private Long teacherId;

 private String teacherName;
}


