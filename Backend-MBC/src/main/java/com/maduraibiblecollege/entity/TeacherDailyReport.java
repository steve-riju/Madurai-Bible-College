package com.maduraibiblecollege.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "teacher_daily_reports")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDailyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long teacherId;           // from User entity
    private String teacherName;       // snapshot of teacher’s name

    private LocalDate date;
    private String batchName;
    private String courseName;
    private String semester;

    private String lessonCovered;
    private LocalTime startTime;
    private LocalTime endTime;
    @Column(length = 1000)
    private String assignmentsGiven;

    @Column(length = 2000)
    private String additionalNotes;

    private LocalDate createdAt;
}
