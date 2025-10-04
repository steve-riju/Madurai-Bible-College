package com.maduraibiblecollege.controller.student;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.maduraibiblecollege.dto.AssignmentDto;
import com.maduraibiblecollege.dto.AssignmentSubmissionDto;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.UserRepository;
import com.maduraibiblecollege.service.AssignmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student/assignments")
@RequiredArgsConstructor
public class StudentAssignmentController {

    private final AssignmentService assignmentService;
    private final UserRepository userRepository;

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<AssignmentDto>> getAssignmentsForBatch(
            @PathVariable Long batchId, Principal principal) {

        User student = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Student not found"));

        return ResponseEntity.ok(
            assignmentService.getAssignmentsForBatch(batchId, student.getId())
        );
    }



    @GetMapping("/{assignmentId}")
    public ResponseEntity<AssignmentDto> getAssignmentDetails(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(
            assignmentService.getAssignmentsForBatch(0L).stream()
                .filter(a -> a.getId().equals(assignmentId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"))
        );
    }

    @PostMapping("/{assignmentId}/submit")
    public ResponseEntity<AssignmentSubmissionDto> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam(required = false) String textAnswer,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            Principal principal) {

        User student = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Student not found"));

        AssignmentSubmissionDto dto = assignmentService.submitAssignment(assignmentId, student.getId(), textAnswer, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<List<AssignmentSubmissionDto>> getMySubmissions(Principal principal) {
        User student = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Student not found"));

        return ResponseEntity.ok(
            assignmentService.listSubmissionsByStudent(student.getId())
        );
    }
    
    @GetMapping("/{assignmentId}/my-submission")
    public ResponseEntity<AssignmentSubmissionDto> getMySubmissionForAssignment(
            @PathVariable Long assignmentId,
            Principal principal) {

        User student = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Student not found"));

        AssignmentSubmissionDto dto = assignmentService.getSubmissionForStudent(assignmentId, student.getId());
        return ResponseEntity.ok(dto);
    }

}

