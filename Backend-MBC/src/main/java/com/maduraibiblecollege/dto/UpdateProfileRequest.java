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
public class UpdateProfileRequest {

    @Size(max = 100)
    private String firstName;

    @Size(max = 100)
    private String lastName;

    @Size(max = 100)
    private String preferredName;

    private Gender gender;

    private LocalDate dateOfBirth;

    private MaritalStatus maritalStatus;

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

    private LanguagePreference languagePreference;
}
