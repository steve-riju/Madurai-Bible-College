package com.maduraibiblecollege.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MaterialDto {
    private Long id;
    private String title;
    private String description;
    private String fileUrl;
    private LocalDateTime uploadedAt;
    private Long courseId;
    private String courseName;
    private Long teacherId;
    private String teacherName;
}


