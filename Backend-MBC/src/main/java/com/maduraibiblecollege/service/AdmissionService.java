package com.maduraibiblecollege.service;

import com.maduraibiblecollege.dto.AdmissionDeadlineRequest;
import com.maduraibiblecollege.dto.AdmissionFormDto;
import com.maduraibiblecollege.dto.AdmissionFormRequest;
import com.maduraibiblecollege.dto.AdmissionFormStatusRequest;
import com.maduraibiblecollege.dto.AdmissionSubmissionDto;
import com.maduraibiblecollege.dto.AdmissionSubmissionRequest;
import com.maduraibiblecollege.dto.AdmissionSubmissionStatusRequest;

import java.util.List;

public interface AdmissionService {
    List<AdmissionFormDto> getPublicForms();
    AdmissionFormDto getPublicForm(String idOrSlug);
    AdmissionSubmissionDto submitApplication(AdmissionSubmissionRequest request);

    List<AdmissionFormDto> getAdminForms();
    AdmissionFormDto createForm(AdmissionFormRequest request);
    AdmissionFormDto updateForm(Long id, AdmissionFormRequest request);
    AdmissionFormDto updateDeadline(Long id, AdmissionDeadlineRequest request);
    AdmissionFormDto updateActiveStatus(Long id, AdmissionFormStatusRequest request);
    AdmissionFormDto archiveForm(Long id);

    List<AdmissionSubmissionDto> getSubmissions(Long formId);
    AdmissionSubmissionDto getSubmission(Long id);
    AdmissionSubmissionDto updateSubmissionStatus(Long id, AdmissionSubmissionStatusRequest request);
}
