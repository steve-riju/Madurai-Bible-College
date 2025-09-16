package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBatchWithEnrollmentsRequest {
 // If provided, we will use this existing batch. Otherwise we'll create a new one using name + semesterId.
 private Long batchId;

 // used when creating a new batch
 private String name;
 private String semesterId;

 // students (must be role STUDENT)
 private List<Long> studentIds;

 // CourseAssigned ids
 private List<Long> courseAssignedIds;
}

