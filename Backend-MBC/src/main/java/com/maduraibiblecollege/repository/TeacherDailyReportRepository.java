package com.maduraibiblecollege.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maduraibiblecollege.entity.TeacherDailyReport;

public interface TeacherDailyReportRepository extends JpaRepository<TeacherDailyReport, Long> {
    List<TeacherDailyReport> findByTeacherId(Long teacherId);
    List<TeacherDailyReport> findByDate(LocalDate date);
}

