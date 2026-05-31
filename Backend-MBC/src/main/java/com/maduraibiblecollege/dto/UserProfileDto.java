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
public class UserProfileDto {

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
}
