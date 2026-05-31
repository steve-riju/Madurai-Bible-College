package com.maduraibiblecollege.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teacher_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Employment Information (admin-editable only)
    @Column(length = 50)
    private String employeeId;

    @Column(length = 150)
    private String designation;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EmploymentType employmentType;

    // Church & Ministry Information (teacher-editable)
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
}
