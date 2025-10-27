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
    
    @Column(length = 100)
    private String teacherName;     

    private LocalDate date;
    
    @Column(length = 100)
    private String batchName;
    
    @Column(length = 200)
    private String courseName;
    
    @Column(length = 100)
    private String semester;

    @Column(length = 500)
    private String lessonCovered;
    private LocalTime startTime;
    private LocalTime endTime;
    
    @Column(length = 2000)
    private String assignmentsGiven;

    @Column(length = 2000)
    private String additionalNotes;

    private LocalDate createdAt;
}
