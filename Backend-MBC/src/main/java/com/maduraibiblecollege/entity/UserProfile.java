package com.maduraibiblecollege.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Personal Information
    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    @Column(length = 100)
    private String preferredName;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MaritalStatus maritalStatus;

    @Column(length = 500)
    private String profilePhotoPath;

    // Contact Information
    @Column(length = 15)
    private String primaryMobile;

    @Column(length = 15)
    private String alternateMobile;

    @Column(length = 150)
    private String personalEmail;

    @Column(length = 500)
    private String permanentAddress;

    @Column(length = 150)
    private String emergencyContactName;

    @Column(length = 100)
    private String emergencyContactRelationship;

    @Column(length = 15)
    private String emergencyContactPhone;

    // Preferences
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private LanguagePreference languagePreference;

    // Audit
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
