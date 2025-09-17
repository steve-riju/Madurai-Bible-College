package com.maduraibiblecollege.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_assigned_id", nullable = false)
    private CourseAssigned courseAssigned;

    @ManyToOne
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch; // added

    private LocalDateTime enrolledAt = LocalDateTime.now(); 
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, DROPPED
}
