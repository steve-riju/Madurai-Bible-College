package com.maduraibiblecollege.dto;

import com.maduraibiblecollege.entity.Gender;
import com.maduraibiblecollege.entity.LanguagePreference;
import com.maduraibiblecollege.entity.MaritalStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateStudentProfileRequest {

    // Personal Information
    @Size(max = 100)
    private String firstName;

    @Size(max = 100)
    private String lastName;

    @Size(max = 100)
    private String preferredName;

    private Gender gender;

    private LocalDate dateOfBirth;

    private MaritalStatus maritalStatus;

    // Contact Information
    @Pattern(regexp = "^[0-9]{10}$", message = "Primary mobile must be exactly 10 digits")
    private String primaryMobile;

    @Pattern(regexp = "^[0-9]{10}$", message = "Alternate mobile must be exactly 10 digits")
    private String alternateMobile;

    @Email(message = "Personal email must be a valid email address")
    @Size(max = 150)
    private String personalEmail;

    @Size(max = 500)
    private String permanentAddress;

    @Size(max = 150)
    private String emergencyContactName;

    @Size(max = 100)
    private String emergencyContactRelationship;

    @Pattern(regexp = "^[0-9]{10}$", message = "Emergency contact phone must be exactly 10 digits")
    private String emergencyContactPhone;

    // Preferences
    private LanguagePreference languagePreference;

    // Church & Ministry Information
    @Size(max = 200)
    private String homeChurch;

    @Size(max = 200)
    private String churchDenomination;

    private Boolean baptized;

    @Size(max = 1000)
    private String ministryExperience;

    @Size(max = 500)
    private String ministryInterests;

    @Size(max = 2000)
    private String callingTestimony;

    // Guardian Information
    @Size(max = 150)
    private String fatherName;

    @Size(max = 150)
    private String motherName;

    @Size(max = 150)
    private String guardianName;

    @Size(max = 100)
    private String guardianRelationship;

    @Pattern(regexp = "^[0-9]{10}$", message = "Guardian phone must be exactly 10 digits")
    private String guardianPhone;
}
