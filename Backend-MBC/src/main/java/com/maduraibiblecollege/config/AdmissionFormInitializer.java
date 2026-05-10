package com.maduraibiblecollege.config;

import com.maduraibiblecollege.dto.AdmissionFormRequest;
import com.maduraibiblecollege.repository.AdmissionFormRepository;
import com.maduraibiblecollege.service.AdmissionService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AdmissionFormInitializer {

    private static final String SISTERS_COURSE_SLUG = "sisters-course";

    private final AdmissionFormRepository formRepository;
    private final AdmissionService admissionService;

    @PostConstruct
    @Transactional
    public void init() {
        if (formRepository.existsBySlug(SISTERS_COURSE_SLUG)) {
            return;
        }

        AdmissionFormRequest request = new AdmissionFormRequest();
        request.setTitle("Sisters Course Application");
        request.setSlug(SISTERS_COURSE_SLUG);
        request.setDescription("Application form for the Sisters Course at Madurai Bible College.");
        request.setDeadline(LocalDateTime.now().plusMonths(3));
        request.setActive(true);

        admissionService.createForm(request);
    }
}
