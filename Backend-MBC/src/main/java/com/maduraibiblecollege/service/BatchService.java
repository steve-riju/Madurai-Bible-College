package com.maduraibiblecollege.service;


import java.util.List;

import com.maduraibiblecollege.dto.BatchCourseRequest;
import com.maduraibiblecollege.dto.BatchCreateRequest;
import com.maduraibiblecollege.dto.BatchDto;
import com.maduraibiblecollege.dto.BatchEnrollmentRequest;
import com.maduraibiblecollege.dto.CreateBatchWithEnrollmentsRequest;

public interface BatchService {
	BatchDto createBatch(BatchCreateRequest request);
	BatchDto addStudents(Long batchId, BatchEnrollmentRequest request);
	BatchDto addCourses(Long batchId, BatchCourseRequest request);
	BatchDto getBatch(Long id);
	List<BatchDto> searchBatches(String keyword);
	BatchDto createBatchWithEnrollments(CreateBatchWithEnrollmentsRequest request);
	void deleteBatch(Long id);
	List<BatchDto> getBatchesForTeacher(Long teacherId);


}

