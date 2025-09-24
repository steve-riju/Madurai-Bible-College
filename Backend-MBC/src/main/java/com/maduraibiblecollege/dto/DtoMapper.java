package com.maduraibiblecollege.dto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.maduraibiblecollege.entity.assignmnets.Assignment;
import com.maduraibiblecollege.entity.assignmnets.AssignmentAttachment;
import com.maduraibiblecollege.entity.assignmnets.AssignmentSubmission;


public final class DtoMapper {

    private DtoMapper() {}


    public static AssignmentDto toAssignmentDto(Assignment a) {
        if (a == null) return null;

        AssignmentDto dto = new AssignmentDto();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());

        dto.setCreatedAt(a.getStartDate());   // ✅ proper type
        dto.setDeadline(a.getEndDate());      // ✅ proper type

        dto.setPublished(a.getStatus() != null && a.getStatus().name().equalsIgnoreCase("PUBLISHED"));
        dto.setBatchId(a.getBatch() != null ? a.getBatch().getId() : null);
        dto.setBatchName(a.getBatch() != null ? a.getBatch().getName() : null);
        dto.setTeacherId(a.getTeacher() != null ? a.getTeacher().getId() : null);
        dto.setTeacherName(a.getTeacher() != null ? a.getTeacher().getUsername() : null);

        List<String> urls = new ArrayList<>();
        if (a.getAttachments() != null) {
            for (AssignmentAttachment att : a.getAttachments()) {
                try {
                    Object v = att.getClass().getMethod("getUrl").invoke(att);
                    if (v != null) urls.add(v.toString());
                } catch (Exception e) {
                    try {
                        Object v = att.getClass().getMethod("getFileUrl").invoke(att);
                        if (v != null) urls.add(v.toString());
                    } catch (Exception ignored) {}
                }
            }
        }
        dto.setAttachmentUrls(urls);
        return dto;
    }


    public static AssignmentSubmissionDto toSubmissionDto(AssignmentSubmission s) {
        if (s == null) return null;

        return AssignmentSubmissionDto.builder()
                .id(s.getId())
                .assignmentId(s.getAssignment() != null ? s.getAssignment().getId() : null)
                .studentId(s.getStudent() != null ? s.getStudent().getId() : null)
                .studentName(s.getStudent() != null ? s.getStudent().getUsername() : null)
                .textAnswer(s.getTextAnswer())
                .submittedAt(s.getSubmittedAt())
                .status(s.getStatus())
                .marksObtained(s.getMarksObtained())
                .teacherRemarks(s.getTeacherRemarks())
                .attemptNumber(s.getAttemptNumber())
                .attachmentUrls(
                    s.getAttachments() != null
                            ? s.getAttachments().stream()
                                  .map(att -> {
                                      try {
                                          if (att.getClass().getMethod("getFileUrl") != null)
                                              return (String) att.getClass().getMethod("getFileUrl").invoke(att);
                                      } catch (Exception ignored) {}
                                      return null;
                                  })
                                  .filter(Objects::nonNull)
                                  .toList()
                            : new ArrayList<>()
                )
                .build();
    }

}
