package com.maduraibiblecollege.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maduraibiblecollege.dto.TeacherDailyReportDto;
import com.maduraibiblecollege.dto.TeacherReportAllocationDto;
import com.maduraibiblecollege.entity.Batch;
import com.maduraibiblecollege.entity.CourseAssigned;
import com.maduraibiblecollege.entity.TeacherDailyReport;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.BatchRepository;
import com.maduraibiblecollege.repository.CourseAssignedRepository;
import com.maduraibiblecollege.repository.TeacherDailyReportRepository;
import com.maduraibiblecollege.repository.UserRepository;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherDailyReportService {

    private final TeacherDailyReportRepository repo;
    private final CourseAssignedRepository courseAssignedRepository;
    private final BatchRepository batchRepository;
    private final UserRepository userRepository;

    public TeacherDailyReportDto submitReport(TeacherDailyReportDto dto) {
        TeacherDailyReport report = TeacherDailyReport.builder()
                .teacherId(dto.getTeacherId())
                .teacherName(dto.getTeacherName())
                .date(dto.getDate())
                .batchId(dto.getBatchId())
                .batchName(dto.getBatchName())
                .courseAssignedId(dto.getCourseAssignedId())
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

    @Transactional(readOnly = true)
    public List<TeacherReportAllocationDto> getAllocationsForTeacher(String username) {
        User teacher = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        return courseAssignedRepository.findByTeacherId(teacher.getId())
                .stream()
                .flatMap(courseAssigned -> batchRepository.findByCourses_Id(courseAssigned.getId())
                        .stream()
                        .map(batch -> toAllocationDto(batch, courseAssigned)))
                .sorted(Comparator
                        .comparing(TeacherReportAllocationDto::getBatchName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER))
                        .thenComparing(TeacherReportAllocationDto::getSemesterName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER))
                        .thenComparing(TeacherReportAllocationDto::getCourseName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
                .toList();
    }

    private TeacherDailyReportDto mapToDto(TeacherDailyReport r) {
    	System.out.println("Teacher Id:"+r.getTeacherId());
    	System.out.println("Teacher Name:"+r.getTeacherName());
        return TeacherDailyReportDto.builder()
                .id(r.getId())
                .teacherId(r.getTeacherId())
                .teacherName(r.getTeacherName())
                .date(r.getDate())
                .batchId(r.getBatchId())
                .batchName(r.getBatchName())
                .courseAssignedId(r.getCourseAssignedId())
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

    private TeacherReportAllocationDto toAllocationDto(Batch batch, CourseAssigned courseAssigned) {
        return TeacherReportAllocationDto.builder()
                .batchId(batch.getId())
                .batchName(batch.getName())
                .courseAssignedId(courseAssigned.getId())
                .courseId(courseAssigned.getCourse().getId())
                .courseName(courseAssigned.getCourse().getName())
                .semesterId(courseAssigned.getSemester().getId())
                .semesterName(courseAssigned.getSemester().getName())
                .build();
    }
}
