package com.maduraibiblecollege.controller.teacher;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.maduraibiblecollege.RejectRequest;
import com.maduraibiblecollege.dto.AssignmentDto;
import com.maduraibiblecollege.dto.AssignmentRequest;
import com.maduraibiblecollege.dto.AssignmentSubmissionDto;
import com.maduraibiblecollege.dto.BatchDto;
import com.maduraibiblecollege.dto.ExtendRequest;
import com.maduraibiblecollege.dto.GradeRequest;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.UserRepository;
import com.maduraibiblecollege.service.AssignmentService;
import com.maduraibiblecollege.service.BatchService;

import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/assignments")
@RequiredArgsConstructor
public class TeacherAssignmentController {

    private final AssignmentService assignmentService;
    private final UserRepository userRepository; // to get currently logged-in teacher
    private final BatchService batchService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AssignmentDto> createAssignment(
        @RequestPart("data") AssignmentRequest request,
        @RequestPart(name = "files", required = false) List<MultipartFile> files,
        Principal principal) {

        User teacher = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Teacher not found"));

        AssignmentDto dto = assignmentService.createAssignment(request, files, teacher);
        // optionally send notifications to batch students
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<AssignmentDto>> getAssignmentsForBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsForBatch(batchId));
    }

    @GetMapping("/{assignmentId}/submissions")
    public ResponseEntity<List<AssignmentSubmissionDto>> listSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.listSubmissions(assignmentId));
    }

    @PutMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<AssignmentSubmissionDto> gradeSubmission(
         @PathVariable Long submissionId, @RequestBody GradeRequest req, Principal principal) {

         User teacher = userRepository.findByUsername(principal.getName())
                 .orElseThrow(() -> new UsernameNotFoundException("Teacher not found"));

         req.setSubmissionId(submissionId);
         return ResponseEntity.ok(assignmentService.gradeSubmission(req, teacher.getId()));
    }

    @PutMapping("/{assignmentId}/extend")
    public ResponseEntity<Map<String, String>> extendDeadline(
            @PathVariable Long assignmentId,
            @RequestBody ExtendRequest req,
            Principal principal) {

        User teacher = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Teacher not found"));

        req.setAssignmentId(assignmentId);
        assignmentService.extendAssignmentDeadline(req, teacher.getId());

        return ResponseEntity.ok(Collections.singletonMap("message", "Deadline extended successfully"));
    }


    @GetMapping("/{assignmentId}/download-all")
    public ResponseEntity<Resource> bulkDownload(@PathVariable Long assignmentId) {
        Resource zip = assignmentService.bulkDownloadSubmissions(assignmentId);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"submissions_"+assignmentId+".zip\"")
            .body(zip);
    }
    
    @GetMapping("/batches")
    public ResponseEntity<List<BatchDto>> getTeacherBatches(Principal principal) {
        User teacher = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Teacher not found"));

        return ResponseEntity.ok(batchService.getBatchesForTeacher(teacher.getId()));
    }

    @GetMapping
    public ResponseEntity<List<AssignmentDto>> getAllAssignments(Principal principal) {
        User teacher = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Teacher not found"));

        return ResponseEntity.ok(assignmentService.getAllAssignmentsByTeacher(teacher.getId()));
    }
    
    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long assignmentId, Principal principal) {
        User teacher = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Teacher not found"));

        assignmentService.deleteAssignment(assignmentId, teacher.getId());
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/submissions/{submissionId}/reject")
    public ResponseEntity<AssignmentSubmissionDto> rejectSubmission(
            @PathVariable Long submissionId,
            @RequestBody RejectRequest req,
            Principal principal) {

        User teacher = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Teacher not found"));

        req.setSubmissionId(submissionId);
        return ResponseEntity.ok(assignmentService.rejectSubmission(req, teacher.getId()));
    }
    
    @GetMapping("/{assignmentId}")
    public ResponseEntity<AssignmentDto> getAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(assignmentId));
    }




}
