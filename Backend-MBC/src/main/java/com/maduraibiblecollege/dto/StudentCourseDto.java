package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class StudentCourseDto {
    private Long id;
    private String code;
    private String name;
    private int credits;
    private String semester;
    private String teacherName;
    private String batchName;
}

