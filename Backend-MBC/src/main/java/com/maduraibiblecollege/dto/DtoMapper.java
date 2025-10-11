package com.maduraibiblecollege.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.maduraibiblecollege.entity.assignmnets.Assignment;
import com.maduraibiblecollege.entity.assignmnets.AssignmentAttachment;
import com.maduraibiblecollege.entity.assignmnets.AssignmentSubmission;
import com.maduraibiblecollege.entity.assignmnets.SubmissionAttachment;
import com.maduraibiblecollege.service.cloud.CloudStorageService;


@Component
public class DtoMapper {

    private final CloudStorageService storageService;

    public DtoMapper(CloudStorageService storageService) {
        this.storageService = storageService;
    }

    public AssignmentDto toAssignmentDto(Assignment a) {
        if (a == null) return null;

        AssignmentDto dto = new AssignmentDto();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setCreatedAt(a.getStartDate());
        dto.setDeadline(a.getEndDate());
        dto.setPublished(a.getStatus() != null && a.getStatus().name().equalsIgnoreCase("PUBLISHED"));
        dto.setBatchId(a.getBatch() != null ? a.getBatch().getId() : null);
        dto.setBatchName(a.getBatch() != null ? a.getBatch().getName() : null);
        dto.setTeacherId(a.getTeacher() != null ? a.getTeacher().getId() : null);
        dto.setTeacherName(a.getTeacher() != null ? a.getTeacher().getUsername() : null);

        List<String> signedUrls = new ArrayList<>();
        if (a.getAttachments() != null) {
            for (AssignmentAttachment att : a.getAttachments()) {
                try {
                    Object v = att.getClass().getMethod("getUrl").invoke(att);
                    if (v != null) signedUrls.add(storageService.generateSignedUrl(v.toString()));
                } catch (Exception e) {
                    try {
                        Object v = att.getClass().getMethod("getFileUrl").invoke(att);
                        if (v != null) signedUrls.add(storageService.generateSignedUrl(v.toString()));
                    } catch (Exception ignored) {}
                }
            }
        }
        dto.setAttachmentUrls(signedUrls);

        return dto;
    }

    public AssignmentSubmissionDto toSubmissionDto(AssignmentSubmission s) {
        if (s == null) return null;

        // Map student attachments
        List<SubmissionAttachmentDto> attachmentDtos = new ArrayList<>();
        if (s.getAttachments() != null) {
            for (SubmissionAttachment att : s.getAttachments()) {
                try {
                    String signedUrl = storageService.generateSignedUrl(att.getFileUrl());
                    attachmentDtos.add(
                        SubmissionAttachmentDto.builder()
                            .fileName(att.getFileName())
                            .fileUrl(signedUrl)
                            .contentType(att.getContentType())
                            .build()
                    );
                } catch (Exception ignored) {}
            }
        }

        // Map teacher attachments as full objects
        List<SubmissionAttachmentDto> teacherAttachments = s.getTeacherAttachments() != null
                ? s.getTeacherAttachments().stream()
                    .map(att -> {
                        try {
                            String signedUrl = storageService.generateSignedUrl(att.getFileUrl());
                            return SubmissionAttachmentDto.builder()
                                    .fileName(att.getFileName())
                                    .fileUrl(signedUrl)
                                    .build();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList())
                : Collections.emptyList();

        return AssignmentSubmissionDto.builder()
                .id(s.getId())
                .assignmentId(s.getAssignment() != null ? s.getAssignment().getId() : null)
                .assignmentTitle(s.getAssignment() != null ? s.getAssignment().getTitle() : null)
                .batchId(s.getAssignment() != null && s.getAssignment().getBatch() != null
                        ? s.getAssignment().getBatch().getId()
                        : null)
                .batchName(s.getAssignment() != null && s.getAssignment().getBatch() != null
                        ? s.getAssignment().getBatch().getName()
                        : null)
                .studentId(s.getStudent() != null ? s.getStudent().getId() : null)
                .studentName(s.getStudent() != null ? s.getStudent().getUsername() : null)
                .textAnswer(s.getTextAnswer())
                .submittedAt(s.getSubmittedAt())
                .status(s.getStatus())
                .marksObtained(s.getMarksObtained())
                .teacherRemarks(s.getTeacherRemarks())
                .attemptNumber(s.getAttemptNumber())
                .attachments(attachmentDtos)
                .teacherAttachments(teacherAttachments) // ✅ fixed mapping
                .build();
    }
}
