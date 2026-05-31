package com.maduraibiblecollege.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Academic Information (admin-editable only)
    @Column(length = 50)
    private String studentIdNumber;

    @Column(length = 50)
    private String admissionNumber;

    @Column(length = 100)
    private String batch;

    @Column(length = 50)
    private String academicYear;

    @Column(length = 150)
    private String program;

    @Column(length = 50)
    private String semester;

    private LocalDate admissionDate;

    // Church & Ministry Information (student-editable)
    @Column(length = 200)
    private String homeChurch;

    @Column(length = 200)
    private String churchDenomination;

    @Builder.Default
    private boolean baptized = false;

    @Column(length = 1000)
    private String ministryExperience;

    @Column(length = 500)
    private String ministryInterests;

    @Column(length = 2000)
    private String callingTestimony;

    // Guardian Information (student-editable)
    @Column(length = 150)
    private String fatherName;

    @Column(length = 150)
    private String motherName;

    @Column(length = 150)
    private String guardianName;

    @Column(length = 100)
    private String guardianRelationship;

    @Column(length = 15)
    private String guardianPhone;
}
