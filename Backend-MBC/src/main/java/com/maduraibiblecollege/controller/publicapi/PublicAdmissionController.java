package com.maduraibiblecollege.controller.publicapi;

import com.maduraibiblecollege.dto.AdmissionFormDto;
import com.maduraibiblecollege.dto.AdmissionSubmissionDto;
import com.maduraibiblecollege.dto.AdmissionSubmissionRequest;
import com.maduraibiblecollege.service.AdmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/admissions")
@RequiredArgsConstructor
public class PublicAdmissionController {

    private final AdmissionService admissionService;

    @GetMapping("/forms")
    public ResponseEntity<List<AdmissionFormDto>> getForms() {
        return ResponseEntity.ok(admissionService.getPublicForms());
    }

    @GetMapping("/forms/{idOrSlug}")
    public ResponseEntity<AdmissionFormDto> getForm(@PathVariable String idOrSlug) {
        return ResponseEntity.ok(admissionService.getPublicForm(idOrSlug));
    }

    @PostMapping("/submit")
    public ResponseEntity<AdmissionSubmissionDto> submit(@Valid @RequestBody AdmissionSubmissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(admissionService.submitApplication(request));
    }
}
