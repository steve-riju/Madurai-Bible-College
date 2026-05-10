package com.maduraibiblecollege.controller.admin;

import com.maduraibiblecollege.dto.AdmissionDeadlineRequest;
import com.maduraibiblecollege.dto.AdmissionFormDto;
import com.maduraibiblecollege.dto.AdmissionFormRequest;
import com.maduraibiblecollege.dto.AdmissionFormStatusRequest;
import com.maduraibiblecollege.dto.AdmissionSubmissionDto;
import com.maduraibiblecollege.dto.AdmissionSubmissionStatusRequest;
import com.maduraibiblecollege.service.AdmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/admissions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAdmissionController {

    private final AdmissionService admissionService;

    @GetMapping("/forms")
    public ResponseEntity<List<AdmissionFormDto>> getForms() {
        return ResponseEntity.ok(admissionService.getAdminForms());
    }

    @PostMapping("/forms")
    public ResponseEntity<AdmissionFormDto> createForm(@Valid @RequestBody AdmissionFormRequest request) {
        return ResponseEntity.ok(admissionService.createForm(request));
    }

    @PutMapping("/forms/{id}")
    public ResponseEntity<AdmissionFormDto> updateForm(
            @PathVariable Long id,
            @Valid @RequestBody AdmissionFormRequest request
    ) {
        return ResponseEntity.ok(admissionService.updateForm(id, request));
    }

    @PatchMapping("/forms/{id}/deadline")
    public ResponseEntity<AdmissionFormDto> updateDeadline(
            @PathVariable Long id,
            @Valid @RequestBody AdmissionDeadlineRequest request
    ) {
        return ResponseEntity.ok(admissionService.updateDeadline(id, request));
    }

    @PatchMapping("/forms/{id}/active")
    public ResponseEntity<AdmissionFormDto> updateActiveStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdmissionFormStatusRequest request
    ) {
        return ResponseEntity.ok(admissionService.updateActiveStatus(id, request));
    }

    @DeleteMapping("/forms/{id}")
    public ResponseEntity<AdmissionFormDto> archiveForm(@PathVariable Long id) {
        return ResponseEntity.ok(admissionService.archiveForm(id));
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<AdmissionSubmissionDto>> getSubmissions(
            @RequestParam(required = false) Long formId
    ) {
        return ResponseEntity.ok(admissionService.getSubmissions(formId));
    }

    @GetMapping("/forms/{id}/submissions")
    public ResponseEntity<List<AdmissionSubmissionDto>> getSubmissionsByForm(@PathVariable Long id) {
        return ResponseEntity.ok(admissionService.getSubmissions(id));
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<AdmissionSubmissionDto> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(admissionService.getSubmission(id));
    }

    @PatchMapping("/submissions/{id}/status")
    public ResponseEntity<AdmissionSubmissionDto> updateSubmissionStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdmissionSubmissionStatusRequest request
    ) {
        return ResponseEntity.ok(admissionService.updateSubmissionStatus(id, request));
    }
}
