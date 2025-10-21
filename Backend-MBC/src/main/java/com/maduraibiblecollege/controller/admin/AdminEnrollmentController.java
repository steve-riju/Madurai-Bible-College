package com.maduraibiblecollege.controller.admin;

import com.maduraibiblecollege.dto.BatchDto;
import com.maduraibiblecollege.dto.EnrollmentDto;
import com.maduraibiblecollege.entity.Role;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.BatchRepository;
import com.maduraibiblecollege.repository.CourseAssignedRepository;
import com.maduraibiblecollege.repository.UserRepository;
import com.maduraibiblecollege.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/admin/enrollments")
@RequiredArgsConstructor
public class AdminEnrollmentController {

    private final EnrollmentService enrollmentService;
    private final UserRepository userRepository;
    private final BatchRepository batchRepository;
    private final CourseAssignedRepository courseAssignedRepository;

    @GetMapping("/students")
    public ResponseEntity<List<StudentDto>> getStudents() {
        List<StudentDto> dtos = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .map(u -> new StudentDto(u.getId(), u.getName() != null ? u.getName() : u.getUsername()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

   
    @GetMapping("/batches")
    public ResponseEntity<List<BatchDto>> getBatches() {
        List<BatchDto> dtos = batchRepository.findAll().stream()
                .map(b -> {
                    BatchDto dto = new BatchDto();
                    dto.setId(b.getId());
                    dto.setName(b.getName());
                    dto.setSemesterId(b.getSemesterId());
                    dto.setSemesterName(b.getSemesterId());
                    dto.setCourses(b.getCourses().stream()
                            .map(ca -> ca.getCourse().getName())
                            .collect(Collectors.toList()));
                    dto.setStudents(b.getStudents().stream()
                            .map(User::getUsername)
                            .collect(Collectors.toList()));
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseDto>> getCourses() {
        List<CourseDto> dtos = courseAssignedRepository.findAll().stream()
                .map(ca -> new CourseDto(ca.getId(), ca.getCourse().getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentDto>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    @PostMapping
    public ResponseEntity<?> enrollStudent(@RequestBody com.maduraibiblecollege.dto.EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.enrollStudent(request));
    }

    @PostMapping("/batch")
    public ResponseEntity<?> enrollBatch(@RequestBody com.maduraibiblecollege.dto.BatchEnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.enrollBatch(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.removeEnrollment(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/course/{courseAssignedId}")
    public ResponseEntity<List<EnrollmentDto>> getByCourse(@PathVariable Long courseAssignedId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCourse(courseAssignedId));
    }

    // ---- small DTO classes used only by this controller to avoid adding new files ----
    public static class StudentDto {
        private Long id;
        private String name;

        public StudentDto() {}

        public StudentDto(Long id, String name) {
            this.id = id;
            this.name = name;
        }
        // getters/setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class CourseDto {
        private Long id;
        private String name;

        public CourseDto() {}
        public CourseDto(Long id, String name) { this.id = id; this.name = name; }
        // getters/setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
    
}
