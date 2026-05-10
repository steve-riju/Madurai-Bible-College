package com.maduraibiblecollege.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "admission_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "form_id", nullable = false)
    private AdmissionForm form;

    @Column(nullable = false, length = 150)
    private String fullNameWithInitials;

    private Integer age;

    @Column(length = 30)
    private String gender;

    @Column(length = 50)
    private String maritalStatus;

    @Column(length = 150)
    private String courseApplied;

    @Column(length = 150)
    private String qualification;

    @Column(length = 150)
    private String currentOccupation;

    @Column(length = 1000)
    private String fullAddress;

    @Column(length = 120)
    private String cityTown;

    @Column(length = 30)
    private String whatsappNumber;

    @Column(length = 200)
    private String churchAssemblyName;

    @Column(length = 150)
    private String evangelistPastorName;

    @Lob
    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AdmissionSubmissionStatus status = AdmissionSubmissionStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}
