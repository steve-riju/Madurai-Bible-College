package com.maduraibiblecollege.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

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

    private LocalDate enrolledAt = LocalDate.now();
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, DROPPED
}
