package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentDto {
    private Long id;
    private StudentDto student;
    private BatchDto batch;
    private CourseDto course;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StudentDto {
        private Long id;
        private String name;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BatchDto {
        private Long id;
        private String name;
        private String semesterName;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CourseDto {
        private Long id;
        private String name;
    }
}
