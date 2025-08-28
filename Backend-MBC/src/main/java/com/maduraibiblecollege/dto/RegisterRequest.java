package com.maduraibiblecollege.dto;

import com.maduraibiblecollege.entity.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
    @NotBlank @Size(min=3, max=50) String username,
    @Email @NotBlank String email,
    @NotBlank @Size(min=6) String password,
    @NotNull Role role
) {}
