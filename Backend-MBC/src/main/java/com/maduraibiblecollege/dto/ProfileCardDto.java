package com.maduraibiblecollege.dto;

import com.maduraibiblecollege.entity.EmploymentType;
import com.maduraibiblecollege.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileCardDto {
    private Long userId;
    private String fullName;
    private String profilePhotoPath;
    private Role role;

    // Student-specific
    private String batch;
    private String academicYear;
    private String program;

    // Teacher-specific
    private String designation;
    private EmploymentType employmentType;
}
