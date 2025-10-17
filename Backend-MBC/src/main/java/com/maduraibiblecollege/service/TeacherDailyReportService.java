package com.maduraibiblecollege.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.maduraibiblecollege.dto.TeacherDailyReportDto;
import com.maduraibiblecollege.entity.TeacherDailyReport;
import com.maduraibiblecollege.repository.TeacherDailyReportRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherDailyReportService {

    private final TeacherDailyReportRepository repo;

    public TeacherDailyReportDto submitReport(TeacherDailyReportDto dto) {
        TeacherDailyReport report = TeacherDailyReport.builder()
                .teacherId(dto.getTeacherId())
                .teacherName(dto.getTeacherName())
                .date(dto.getDate())
                .batchName(dto.getBatchName())
                .courseName(dto.getCourseName())
                .semester(dto.getSemester())
                .lessonCovered(dto.getLessonCovered())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .assignmentsGiven(dto.getAssignmentsGiven())
                .additionalNotes(dto.getAdditionalNotes())
                .createdAt(LocalDate.now())
                .build();

        TeacherDailyReport saved = repo.save(report);
        return mapToDto(saved);
    }

    public List<TeacherDailyReportDto> getAllReports() {
        return repo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<TeacherDailyReportDto> getReportsByTeacher(Long teacherId) {
        return repo.findByTeacherId(teacherId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private TeacherDailyReportDto mapToDto(TeacherDailyReport r) {
    	System.out.println("Teacher Id:"+r.getTeacherId());
    	System.out.println("Teacher Name:"+r.getTeacherName());
        return TeacherDailyReportDto.builder()
                .id(r.getId())
                .teacherId(r.getTeacherId())
                .teacherName(r.getTeacherName())
                .date(r.getDate())
                .batchName(r.getBatchName())
                .courseName(r.getCourseName())
                .semester(r.getSemester())
                .lessonCovered(r.getLessonCovered())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                .assignmentsGiven(r.getAssignmentsGiven())
                .additionalNotes(r.getAdditionalNotes())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
