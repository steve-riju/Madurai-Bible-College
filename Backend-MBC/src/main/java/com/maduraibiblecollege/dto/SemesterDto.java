package com.maduraibiblecollege.dto;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SemesterDto {
 private Long id;

 @NotBlank(message = "Semester name is required")
 private String name;

 @NotNull(message = "Start date is required")
 private LocalDate startDate;

 @NotNull(message = "End date is required")
 private LocalDate endDate;
}
		

