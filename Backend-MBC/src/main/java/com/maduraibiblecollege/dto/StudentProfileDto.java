package com.maduraibiblecollege.dto;

import com.maduraibiblecollege.entity.Gender;
import com.maduraibiblecollege.entity.LanguagePreference;
import com.maduraibiblecollege.entity.MaritalStatus;
import com.maduraibiblecollege.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDto {

    // Account Info (read-only)
    private Long userId;
    private String username;
    private Role role;
    private boolean accountStatus;
    private Instant createdAt;

    // Personal Information
    private String firstName;
    private String lastName;
    private String preferredName;
    private Gender gender;
    private LocalDate dateOfBirth;
    private MaritalStatus maritalStatus;
    private String profilePhotoPath;

    // Contact Information
    private String primaryMobile;
    private String alternateMobile;
    private String personalEmail;
    private String permanentAddress;
    private String emergencyContactName;
    private String emergencyContactRelationship;
    private String emergencyContactPhone;

    // Preferences
    private LanguagePreference languagePreference;

    // Academic Information (read-only for students)
    private String studentIdNumber;
    private String admissionNumber;
    private String batch;
    private String academicYear;
    private String program;
    private String semester;
    private LocalDate admissionDate;

    // Church & Ministry Information
    private String homeChurch;
    private String churchDenomination;
    private boolean baptized;
    private String ministryExperience;
    private String ministryInterests;
    private String callingTestimony;

    // Guardian Information
    private String fatherName;
    private String motherName;
    private String guardianName;
    private String guardianRelationship;
    private String guardianPhone;
}
