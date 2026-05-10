package com.maduraibiblecollege.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maduraibiblecollege.dto.AdmissionDeadlineRequest;
import com.maduraibiblecollege.dto.AdmissionFormDto;
import com.maduraibiblecollege.dto.AdmissionFormFieldDto;
import com.maduraibiblecollege.dto.AdmissionFormRequest;
import com.maduraibiblecollege.dto.AdmissionFormStatusRequest;
import com.maduraibiblecollege.dto.AdmissionSubmissionDto;
import com.maduraibiblecollege.dto.AdmissionSubmissionRequest;
import com.maduraibiblecollege.dto.AdmissionSubmissionStatusRequest;
import com.maduraibiblecollege.entity.AdmissionForm;
import com.maduraibiblecollege.entity.AdmissionSubmission;
import com.maduraibiblecollege.exception.BusinessException;
import com.maduraibiblecollege.exception.ResourceNotFoundException;
import com.maduraibiblecollege.exception.ValidationException;
import com.maduraibiblecollege.repository.AdmissionFormRepository;
import com.maduraibiblecollege.repository.AdmissionSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class AdmissionServiceImpl implements AdmissionService {

    private static final Pattern SLUG_PATTERN = Pattern.compile("[^a-z0-9]+");
    private static final Pattern WHATSAPP_PATTERN = Pattern.compile("^[0-9+\\-\\s]{7,20}$");

    private final AdmissionFormRepository formRepository;
    private final AdmissionSubmissionRepository submissionRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionFormDto> getPublicForms() {
        return formRepository.findByActiveTrueOrderByDeadlineAscTitleAsc()
                .stream()
                .map(this::toFormDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdmissionFormDto getPublicForm(String idOrSlug) {
        AdmissionForm form = findFormByIdOrSlug(idOrSlug);
        if (!form.isActive()) {
            throw new ResourceNotFoundException("Admission form", idOrSlug);
        }
        return toFormDto(form);
    }

    @Override
    public AdmissionSubmissionDto submitApplication(AdmissionSubmissionRequest request) {
        AdmissionForm form = formRepository.findById(request.getFormId())
                .orElseThrow(() -> new ResourceNotFoundException("Admission form", request.getFormId()));

        if (!isOpen(form)) {
            throw new BusinessException("This admission form is closed. Please contact the office for assistance.");
        }

        Map<String, String> answers = normalizeAnswers(request.getAnswers());
        answers.putIfAbsent("courseApplied", form.getTitle());
        validateAnswers(form, answers);

        AdmissionSubmission submission = new AdmissionSubmission();
        submission.setForm(form);
        submission.setFullNameWithInitials(answers.get("fullNameWithInitials"));
        submission.setAge(parseAge(answers.get("age")));
        submission.setGender(answers.get("gender"));
        submission.setMaritalStatus(answers.get("maritalStatus"));
        submission.setCourseApplied(answers.get("courseApplied"));
        submission.setQualification(answers.get("qualification"));
        submission.setCurrentOccupation(answers.get("currentOccupation"));
        submission.setFullAddress(answers.get("fullAddress"));
        submission.setCityTown(answers.get("cityTown"));
        submission.setWhatsappNumber(answers.get("whatsappNumber"));
        submission.setChurchAssemblyName(answers.get("churchAssemblyName"));
        submission.setEvangelistPastorName(answers.get("evangelistPastorName"));
        submission.setAnswersJson(writeAnswers(answers));

        return toSubmissionDto(submissionRepository.save(submission));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionFormDto> getAdminForms() {
        return formRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toFormDto)
                .toList();
    }

    @Override
    public AdmissionFormDto createForm(AdmissionFormRequest request) {
        String slug = normalizeSlug(request.getSlug(), request.getTitle(), null);

        AdmissionForm form = new AdmissionForm();
        form.setTitle(request.getTitle().trim());
        form.setDescription(clean(request.getDescription()));
        form.setSlug(slug);
        form.setDeadline(request.getDeadline());
        form.setActive(request.getActive() == null || request.getActive());
        form.setFieldsJson(writeFields(resolveRequestFields(request.getFields())));

        return toFormDto(formRepository.save(form));
    }

    @Override
    public AdmissionFormDto updateForm(Long id, AdmissionFormRequest request) {
        AdmissionForm form = formRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission form", id));

        String slug = normalizeSlug(request.getSlug(), request.getTitle(), id);
        form.setTitle(request.getTitle().trim());
        form.setDescription(clean(request.getDescription()));
        form.setSlug(slug);
        form.setDeadline(request.getDeadline());
        form.setActive(request.getActive() == null || request.getActive());
        form.setFieldsJson(writeFields(resolveRequestFields(request.getFields())));

        return toFormDto(formRepository.save(form));
    }

    @Override
    public AdmissionFormDto updateDeadline(Long id, AdmissionDeadlineRequest request) {
        AdmissionForm form = formRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission form", id));
        form.setDeadline(request.getDeadline());
        return toFormDto(formRepository.save(form));
    }

    @Override
    public AdmissionFormDto updateActiveStatus(Long id, AdmissionFormStatusRequest request) {
        AdmissionForm form = formRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission form", id));
        form.setActive(request.getActive());
        return toFormDto(formRepository.save(form));
    }

    @Override
    public AdmissionFormDto archiveForm(Long id) {
        AdmissionForm form = formRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission form", id));
        form.setActive(false);
        return toFormDto(formRepository.save(form));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionSubmissionDto> getSubmissions(Long formId) {
        List<AdmissionSubmission> submissions = formId == null
                ? submissionRepository.findAllByOrderBySubmittedAtDesc()
                : submissionRepository.findByFormIdOrderBySubmittedAtDesc(formId);
        return submissions.stream().map(this::toSubmissionDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdmissionSubmissionDto getSubmission(Long id) {
        return submissionRepository.findById(id)
                .map(this::toSubmissionDto)
                .orElseThrow(() -> new ResourceNotFoundException("Admission submission", id));
    }

    @Override
    public AdmissionSubmissionDto updateSubmissionStatus(Long id, AdmissionSubmissionStatusRequest request) {
        AdmissionSubmission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission submission", id));
        submission.setStatus(request.getStatus());
        return toSubmissionDto(submissionRepository.save(submission));
    }

    public List<AdmissionFormFieldDto> defaultFields() {
        return List.of(
                field("fullNameWithInitials", "Full Name with Initials", "text", true, 150),
                field("age", "Age", "number", true, 3),
                field("gender", "Gender", "select", true, null, List.of("Female", "Male", "Other")),
                field("maritalStatus", "Marital Status", "select", true, null, List.of("Single", "Married", "Widowed")),
                field("courseApplied", "Course Applied", "text", true, 150),
                field("qualification", "Qualification", "text", true, 150),
                field("currentOccupation", "Current Occupation", "text", true, 150),
                field("fullAddress", "Full Address", "textarea", true, 1000),
                field("cityTown", "City/Town", "text", true, 120),
                field("whatsappNumber", "WhatsApp Number", "tel", true, 30),
                field("churchAssemblyName", "Church/Assembly Name", "text", true, 200),
                field("evangelistPastorName", "Evangelist/Pastor Name", "text", true, 150)
        );
    }

    private AdmissionFormFieldDto field(String key, String label, String type, boolean required, Integer maxLength) {
        return field(key, label, type, required, maxLength, List.of());
    }

    private AdmissionFormFieldDto field(
            String key,
            String label,
            String type,
            boolean required,
            Integer maxLength,
            List<String> options
    ) {
        return AdmissionFormFieldDto.builder()
                .key(key)
                .label(label)
                .type(type)
                .required(required)
                .maxLength(maxLength)
                .options(options)
                .build();
    }

    private AdmissionForm findFormByIdOrSlug(String idOrSlug) {
        try {
            Long id = Long.parseLong(idOrSlug);
            return formRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Admission form", id));
        } catch (NumberFormatException ignored) {
            return formRepository.findBySlug(idOrSlug)
                    .orElseThrow(() -> new ResourceNotFoundException("Admission form", idOrSlug));
        }
    }

    private AdmissionFormDto toFormDto(AdmissionForm form) {
        return AdmissionFormDto.builder()
                .id(form.getId())
                .title(form.getTitle())
                .description(form.getDescription())
                .slug(form.getSlug())
                .deadline(form.getDeadline())
                .active(form.isActive())
                .open(isOpen(form))
                .fields(readFields(form.getFieldsJson()))
                .createdAt(form.getCreatedAt())
                .updatedAt(form.getUpdatedAt())
                .build();
    }

    private AdmissionSubmissionDto toSubmissionDto(AdmissionSubmission submission) {
        AdmissionForm form = submission.getForm();
        return AdmissionSubmissionDto.builder()
                .id(submission.getId())
                .formId(form.getId())
                .formTitle(form.getTitle())
                .formSlug(form.getSlug())
                .fullNameWithInitials(submission.getFullNameWithInitials())
                .age(submission.getAge())
                .gender(submission.getGender())
                .maritalStatus(submission.getMaritalStatus())
                .courseApplied(submission.getCourseApplied())
                .qualification(submission.getQualification())
                .currentOccupation(submission.getCurrentOccupation())
                .fullAddress(submission.getFullAddress())
                .cityTown(submission.getCityTown())
                .whatsappNumber(submission.getWhatsappNumber())
                .churchAssemblyName(submission.getChurchAssemblyName())
                .evangelistPastorName(submission.getEvangelistPastorName())
                .answers(readAnswers(submission.getAnswersJson()))
                .status(submission.getStatus())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }

    private boolean isOpen(AdmissionForm form) {
        return form.isActive()
                && form.getDeadline() != null
                && !form.getDeadline().isBefore(LocalDateTime.now());
    }

    private String normalizeSlug(String requestedSlug, String title, Long existingId) {
        String base = clean(requestedSlug);
        if (base == null || base.isBlank()) {
            base = title;
        }
        base = SLUG_PATTERN.matcher(base.toLowerCase(Locale.ROOT).trim()).replaceAll("-");
        base = base.replaceAll("(^-|-$)", "");
        if (base.isBlank()) {
            base = "admission-form";
        }

        String slug = base;
        int suffix = 2;
        while (existingId == null ? formRepository.existsBySlug(slug) : formRepository.existsBySlugAndIdNot(slug, existingId)) {
            slug = base + "-" + suffix;
            suffix++;
        }
        return slug;
    }

    private List<AdmissionFormFieldDto> resolveRequestFields(List<AdmissionFormFieldDto> fields) {
        if (fields == null || fields.isEmpty()) {
            return defaultFields();
        }
        return fields;
    }

    private List<AdmissionFormFieldDto> readFields(String fieldsJson) {
        if (fieldsJson == null || fieldsJson.isBlank()) {
            return defaultFields();
        }
        try {
            List<AdmissionFormFieldDto> fields = objectMapper.readValue(
                    fieldsJson,
                    new TypeReference<List<AdmissionFormFieldDto>>() {}
            );
            return fields == null || fields.isEmpty() ? defaultFields() : fields;
        } catch (JsonProcessingException ex) {
            return defaultFields();
        }
    }

    private String writeFields(List<AdmissionFormFieldDto> fields) {
        try {
            return objectMapper.writeValueAsString(fields);
        } catch (JsonProcessingException ex) {
            throw new BusinessException("Unable to save admission form fields.");
        }
    }

    private Map<String, String> normalizeAnswers(Map<String, String> answers) {
        Map<String, String> normalized = new LinkedHashMap<>();
        answers.forEach((key, value) -> normalized.put(key, clean(value)));
        return normalized;
    }

    private void validateAnswers(AdmissionForm form, Map<String, String> answers) {
        List<String> errors = new ArrayList<>();
        for (AdmissionFormFieldDto field : readFields(form.getFieldsJson())) {
            String value = answers.get(field.getKey());
            if (field.isRequired() && (value == null || value.isBlank())) {
                errors.add(field.getLabel() + " is required");
            }
            if (value != null && field.getMaxLength() != null && value.length() > field.getMaxLength()) {
                errors.add(field.getLabel() + " must be " + field.getMaxLength() + " characters or fewer");
            }
        }

        Integer age = parseAge(answers.get("age"));
        if (age != null && (age < 1 || age > 120)) {
            errors.add("Age must be between 1 and 120");
        }

        String whatsapp = answers.get("whatsappNumber");
        if (whatsapp != null && !whatsapp.isBlank() && !WHATSAPP_PATTERN.matcher(whatsapp).matches()) {
            errors.add("WhatsApp Number must be a valid phone number");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException("Admission application validation failed", errors);
        }
    }

    private Integer parseAge(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            throw new ValidationException("Age must be a valid number");
        }
    }

    private String writeAnswers(Map<String, String> answers) {
        try {
            return objectMapper.writeValueAsString(answers);
        } catch (JsonProcessingException ex) {
            throw new BusinessException("Unable to save admission application answers.");
        }
    }

    private Map<String, String> readAnswers(String answersJson) {
        if (answersJson == null || answersJson.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(answersJson, new TypeReference<Map<String, String>>() {});
        } catch (JsonProcessingException ex) {
            return Map.of();
        }
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
