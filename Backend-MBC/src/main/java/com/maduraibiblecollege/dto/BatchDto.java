package com.maduraibiblecollege.dto;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchDto {
 private Long id;
 private String name;
 private String semesterId;
 private List<String> courses;   // course names
 private List<String> students;  // student usernames
 private String semesterName;
 
public BatchDto(Long id, String name, String semesterId) {
	super();
	this.id = id;
	this.name = name;
	this.semesterId = semesterId;
}
 
 
}
