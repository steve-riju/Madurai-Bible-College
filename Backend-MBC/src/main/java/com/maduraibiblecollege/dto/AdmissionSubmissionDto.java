package com.maduraibiblecollege.dto;

import com.maduraibiblecollege.entity.AdmissionSubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionSubmissionDto {
    private Long id;
    private Long formId;
    private String formTitle;
    private String formSlug;
    private String fullNameWithInitials;
    private Integer age;
    private String gender;
    private String maritalStatus;
    private String courseApplied;
    private String qualification;
    private String currentOccupation;
    private String fullAddress;
    private String cityTown;
    private String whatsappNumber;
    private String churchAssemblyName;
    private String evangelistPastorName;
    private Map<String, String> answers;
    private AdmissionSubmissionStatus status;
    private LocalDateTime submittedAt;
}
