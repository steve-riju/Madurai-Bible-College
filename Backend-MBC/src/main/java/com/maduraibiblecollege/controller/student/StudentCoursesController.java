package com.maduraibiblecollege.controller.student;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maduraibiblecollege.dto.MaterialDto;
import com.maduraibiblecollege.dto.StudentCourseDto;
import com.maduraibiblecollege.entity.Enrollment;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.EnrollmentRepository;
import com.maduraibiblecollege.service.TeacherMaterialService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student/courses")
@RequiredArgsConstructor
public class StudentCoursesController {

    private final EnrollmentRepository enrollmentRepo;
    private final TeacherMaterialService materialService;

    @GetMapping
    public List<StudentCourseDto> getMyCourses(@AuthenticationPrincipal User user) {
        List<Enrollment> enrollments = enrollmentRepo.findByStudent(user);

        return enrollments.stream().map(e -> new StudentCourseDto(
                e.getCourseAssigned().getCourse().getId(),
                e.getCourseAssigned().getCourse().getCode(),
                e.getCourseAssigned().getCourse().getName(),
                e.getCourseAssigned().getCourse().getCredits(),
                e.getCourseAssigned().getSemester().getName(),
                getTeacherDisplayName(e.getCourseAssigned().getTeacher()),
                e.getBatch().getName()
        )).toList();
    }

    private String getTeacherDisplayName(User teacher) {
        if (teacher == null) return "Unknown";
        if (teacher.getName() != null) return teacher.getName();
        return teacher.getUsername(); // fallback
    }

    // ✅ Materials endpoint
    @GetMapping("/{courseId}/materials")
    public ResponseEntity<List<MaterialDto>> getMaterialsForCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User user
    ) {
        // 🔒 Optional: Verify student is enrolled
        boolean enrolled = enrollmentRepo.findByStudent(user).stream()
                .anyMatch(e -> e.getCourseAssigned().getCourse().getId().equals(courseId));

        if (!enrolled) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(materialService.getMaterialsByCourse(courseId));
    }
}
