package com.maduraibiblecollege.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.maduraibiblecollege.dto.AssignmentDto;
import com.maduraibiblecollege.dto.StudentDashboardDto;
import com.maduraibiblecollege.entity.Batch;
import com.maduraibiblecollege.entity.Enrollment;
import com.maduraibiblecollege.entity.Semester;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.EnrollmentRepository;
import com.maduraibiblecollege.repository.MaterialRepository;
import com.maduraibiblecollege.repository.SemesterRepository;
import com.maduraibiblecollege.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentDashboardServiceImpl implements StudentDashboardService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MaterialRepository materialRepository;
    private final AssignmentService assignmentService;
    private final SemesterRepository semesterRepository;
//    private final NoticeRepository noticeRepository; // optional fallback

    @Override
    public StudentDashboardDto getDashboardData(String username) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 🎓 Fetch all enrollments
        List<Enrollment> allEnrollments = enrollmentRepository.findByStudent(student);

        // 🔹 Extract all unique batches
        List<Batch> batches = allEnrollments.stream()
                .map(Enrollment::getBatch)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        
        System.out.println("______________: "+batches);

        // 🔹 Collect all semester IDs (safe parse)
        Set<Long> semesterIds = batches.stream()
                .map(b -> {
                    try {
                    	System.out.println("sem id's: "+Long.parseLong(b.getSemesterId()));
                        return Long.parseLong(b.getSemesterId());
                    } catch (NumberFormatException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 🔹 Map semesterId → Semester
        Map<Long, Semester> semesterMap = semesterRepository.findAllById(semesterIds)
                .stream()
                .collect(Collectors.toMap(Semester::getId, s -> s));

        LocalDate today = LocalDate.now();

        // 🔹 Filter enrollments belonging to current semester
        List<Enrollment> currentSemesterEnrollments = allEnrollments.stream()
                .filter(e -> {
                    Long semId = null;
                    try {
                        semId = Long.parseLong(e.getBatch().getSemesterId());
                        System.out.println("Sem id in current enrol: "+ semId);
                    } catch (NumberFormatException ignored) {}

                    Semester sem = semesterMap.get(semId);
                    System.out.println("Value of sem in cur : "+sem);
                    if (sem == null) return false;

                    LocalDate start = sem.getStartDate();
                    LocalDate end = sem.getEndDate();

                    return (start != null && end != null &&
                            (today.isEqual(start) || today.isAfter(start)) &&
                            (today.isBefore(end) || today.isEqual(end)));
                })
                .toList();
        System.out.println("Current sem: "+currentSemesterEnrollments);

        // 🎓 Build course info table (only current semester)
        List<StudentDashboardDto.CourseInfo> myCourses = currentSemesterEnrollments.stream()
                .map(e -> new StudentDashboardDto.CourseInfo(
                        e.getCourseAssigned().getCourse().getName(),
                        e.getBatch().getName(),
                        e.getCourseAssigned().getTeacher().getName()
                ))
                .toList();
        System.out.println("My Course: "+myCourses);
        long courseCount = allEnrollments.size();

        // 📚 Materials count
        long materialCount = allEnrollments.stream()
                .map(e -> e.getCourseAssigned().getCourse().getId())
                .distinct()
                .mapToLong(courseId -> materialRepository.countByCourseId(courseId))
                .sum();

        // 📝 Fetch all assignments (for current semester batches)
        List<AssignmentDto> allAssignments = allEnrollments.stream()
                .flatMap(e -> assignmentService
                        .getAssignmentsForBatch(e.getBatch().getId(), student.getId())
                        .stream())
                .distinct()
                .toList();

        // ⚠️ Pending Assignments
        long pendingAssignments = allAssignments.stream()
                .filter(a -> !a.isSubmitted())
                .count();

        // 🕒 Sort assignments by due date (earliest first)
        List<StudentDashboardDto.AssignmentInfo> recentAssignments = allAssignments.stream()
                .sorted(Comparator.comparing(
                        a -> a.getDeadline() != null ? a.getDeadline() : LocalDateTime.MAX
                ))
                .limit(5)
                .map(a -> new StudentDashboardDto.AssignmentInfo(
                        a.getTitle(),
                        a.getDeadline() != null
                                ? a.getDeadline().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                                : "N/A"
                ))
                .toList();

        // 📢 Notices fallback
        long noticeCount = 0;
        try {
//            noticeCount = noticeRepository.count();
        } catch (Exception ignored) {}

        // ✅ Final DTO
        return StudentDashboardDto.builder()
                .courseCount(courseCount)
                .materialCount(materialCount)
                .pendingAssignments(pendingAssignments)
                .noticeCount(noticeCount)
                .myCourses(myCourses)
                .recentAssignments(recentAssignments)
                .build();
    }
}
