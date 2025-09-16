package com.maduraibiblecollege.service;

import java.util.List;

import com.maduraibiblecollege.dto.BatchEnrollmentRequest;
import com.maduraibiblecollege.dto.EnrollmentDto;
import com.maduraibiblecollege.dto.EnrollmentRequest;
import com.maduraibiblecollege.entity.Enrollment;

public interface EnrollmentService {
    Enrollment enrollStudent(EnrollmentRequest request);
    List<Enrollment> enrollBatch(BatchEnrollmentRequest request);
    void removeEnrollment(Long enrollmentId);
    List<EnrollmentDto> getEnrollmentsByCourse(Long courseAssignedId);
    List<EnrollmentDto> getAllEnrollments();

}
