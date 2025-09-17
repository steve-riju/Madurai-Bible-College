package com.maduraibiblecollege.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class AdminDashboardDto {
    public UserStats userStats;
    public CourseStats courseStats;
    public EnrollmentStats enrollmentStats;
    public AdmissionsStats admissionsStats;
    public OfferingsSummary offerings;
    public List<EventDto> events;
    public List<SimpleAdmissionDto> recentAdmissions;
    public List<OfferingDto> recentOfferings;

    public static class UserStats {
        public long students;
        public long teachers;
        public long admins;
    }

    public static class CourseStats {
        public long totalCourses;
        public long active;
        public long inactive;
    }

    public static class EnrollmentStats {
        public long current;
        public long previous;
    }

    public static class AdmissionsStats {
        public long pending;
        public long approved;
        public long rejected;
    }

    public static class OfferingsSummary {
        public BigDecimal totalThisMonth;
        public BigDecimal totalThisYear;
    }

    public static class EventDto {
        public Long id;
        public String title;
        public LocalDate date;
    }

    public static class SimpleAdmissionDto {
        public Long id;
        public String name;
        public String status;
    }

    public static class OfferingDto {
        public Long id;
        public String donor;
        public BigDecimal amount;
        public LocalDate date;
    }
}

