package com.maduraibiblecollege.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.maduraibiblecollege.dto.TeacherBatchSummaryDto;
import com.maduraibiblecollege.dto.TeacherDashboardDto;
import com.maduraibiblecollege.entity.Batch;
import com.maduraibiblecollege.entity.CourseAssigned;
import com.maduraibiblecollege.entity.Semester;
import com.maduraibiblecollege.entity.assignmnets.Assignment;
import com.maduraibiblecollege.repository.AssignmentRepository;
import com.maduraibiblecollege.repository.BatchRepository;
import com.maduraibiblecollege.repository.CourseAssignedRepository;
import com.maduraibiblecollege.repository.MaterialRepository;
import com.maduraibiblecollege.repository.SemesterRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherDashboardServiceImpl implements TeacherDashboardService {

    private final AssignmentRepository assignmentRepository;
    private final MaterialRepository materialRepository;
    private final TeacherDailyReportService reportService;
    private final BatchRepository batchRepository;
    private final CourseAssignedRepository courseAssignedRepository;
    private final SemesterRepository semesterRepository;

    @Override
    public TeacherDashboardDto getDashboardData(Long teacherId) {

        // 🔹 Basic dashboard counts
        long assignmentCount = assignmentRepository.countByTeacherId(teacherId);
        long materialCount = materialRepository.countByTeacherId(teacherId);
        long reportCount = reportService.getReportsByTeacher(teacherId).size();

        // 🔹 Get all courses taught by this teacher
        List<CourseAssigned> coursesTaught = courseAssignedRepository.findByTeacherId(teacherId);
        Set<Long> courseIds = coursesTaught.stream()
                .map(CourseAssigned::getId)
                .collect(Collectors.toSet());

        // 🔹 Fetch batches that include any of these courses
        List<Batch> batches = new ArrayList<>();
        if (!courseIds.isEmpty()) {
            batches = batchRepository.findByCourses_IdIn(courseIds);
        }

        long batchCount = batches.size();

        // 🔹 Collect all semester IDs as Long (safe parse)
        Set<Long> semesterIds = batches.stream()
                .map(b -> {
                    try {
                        return Long.parseLong(b.getSemesterId());
                    } catch (NumberFormatException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 🔹 Map semesterId → Semester entity
        Map<Long, Semester> semesterMap = semesterRepository.findAllById(semesterIds)
                .stream()
                .collect(Collectors.toMap(Semester::getId, s -> s));

        LocalDate today = LocalDate.now();

        // 🔹 Build batch summary DTOs
        List<TeacherBatchSummaryDto> batchSummaries = batches.stream()
                .map(b -> {
                    Long semId = null;
                    try {
                        semId = Long.parseLong(b.getSemesterId());
                    } catch (NumberFormatException ignored) {}

                    Semester sem = semesterMap.get(semId);
                    LocalDate start = (sem != null) ? sem.getStartDate() : null;
                    LocalDate end = (sem != null) ? sem.getEndDate() : null;

                    // Determine if this semester is current
                    boolean isCurrent = false;
                    if (start != null && end != null) {
                        isCurrent = (today.isEqual(start) || today.isAfter(start)) &&
                                    (today.isEqual(end) || today.isBefore(end));
                    }
                    return TeacherBatchSummaryDto.builder()
                            .id(b.getId())
                            .name(b.getName())
                            .semesterName(sem != null ? sem.getName() : "Unknown")
                            .totalStudents(b.getStudents().size())
                            .semesterStartDate(start)
                            .semesterEndDate(end)
                            .isCurrentSemester(isCurrent)
                            .build();
                })
                // 🔹 Sort: current semesters first → then by start date (newest first)
                .sorted((a, b) -> {
                    if (a.isCurrentSemester() && !b.isCurrentSemester()) return -1;
                    if (!a.isCurrentSemester() && b.isCurrentSemester()) return 1;

                    LocalDate d1 = a.getSemesterStartDate();
                    LocalDate d2 = b.getSemesterStartDate();
                    if (d1 == null && d2 == null) return 0;
                    if (d1 == null) return 1;
                    if (d2 == null) return -1;
                    return d2.compareTo(d1);
                })
                .toList();

        // 🔹 Get 5 most recent assignment titles
        List<String> recentAssignments = assignmentRepository
                .findTop5ByTeacherIdOrderByStartDateDesc(teacherId)
                .stream()
                .map(Assignment::getTitle)
                .toList();

        // 🔹 Final DTO
        return TeacherDashboardDto.builder()
                .assignmentCount(assignmentCount)
                .materialCount(materialCount)
                .reportCount(reportCount)
                .batchCount(batchCount)
                .recentAssignments(recentAssignments)
                .myBatches(batchSummaries)
                .build();
    }
}