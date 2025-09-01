package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//CourseDto.java
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CourseDto {
 private Long id;

 @NotBlank(message = "Course code is required")
 private String code;

 @NotBlank(message = "Course name is required")
 private String name;

 @Min(value = 0, message = "Credits cannot be negative")
 private int credits;
}


