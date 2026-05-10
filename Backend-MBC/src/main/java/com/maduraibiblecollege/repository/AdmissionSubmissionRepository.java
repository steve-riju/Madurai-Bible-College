package com.maduraibiblecollege.repository;

import com.maduraibiblecollege.entity.AdmissionSubmission;
import com.maduraibiblecollege.entity.AdmissionSubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionSubmissionRepository extends JpaRepository<AdmissionSubmission, Long> {
    List<AdmissionSubmission> findAllByOrderBySubmittedAtDesc();
    List<AdmissionSubmission> findByFormIdOrderBySubmittedAtDesc(Long formId);
    List<AdmissionSubmission> findTop5ByOrderBySubmittedAtDesc();
    long countByStatus(AdmissionSubmissionStatus status);
}
