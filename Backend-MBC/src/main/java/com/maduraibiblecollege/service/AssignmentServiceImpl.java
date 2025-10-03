package com.maduraibiblecollege.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.maduraibiblecollege.dto.AssignmentDto;
import com.maduraibiblecollege.dto.AssignmentSubmissionDto;
import com.maduraibiblecollege.dto.DtoMapper;
import com.maduraibiblecollege.dto.AssignmentRequest;
import com.maduraibiblecollege.dto.ExtendRequest;
import com.maduraibiblecollege.dto.GradeRequest;
import com.maduraibiblecollege.entity.Batch;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.entity.assignmnets.Assignment;
import com.maduraibiblecollege.entity.assignmnets.AssignmentAttachment;
import com.maduraibiblecollege.entity.assignmnets.AssignmentStatus;
import com.maduraibiblecollege.entity.assignmnets.AssignmentSubmission;
import com.maduraibiblecollege.entity.assignmnets.SubmissionAttachment;
import com.maduraibiblecollege.entity.assignmnets.SubmissionStatus;
import com.maduraibiblecollege.repository.AssignmentRepository;
import com.maduraibiblecollege.repository.AssignmentSubmissionRepository;
import com.maduraibiblecollege.repository.BatchRepository;
import com.maduraibiblecollege.repository.UserRepository;
import com.maduraibiblecollege.service.cloud.CloudStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepo;
    private final AssignmentSubmissionRepository submissionRepo;
    private final BatchRepository batchRepo;
    private final UserRepository userRepo;
    private final CloudStorageService storageService;

    @Override
    public AssignmentDto createAssignment(AssignmentRequest request, List<MultipartFile> attachments, User teacher) {
        Batch batch = batchRepo.findById(request.getBatchId())
                .orElseThrow(() -> new IllegalArgumentException("Batch not found"));

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        // use provided startDate/endDate from request if present, else null
        assignment.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now());
        assignment.setEndDate(request.getEndDate());
        assignment.setMaxMarks(request.getMaxMarks());
        assignment.setStatus(request.getStatus() != null ? request.getStatus() : AssignmentStatus.PUBLISHED);
        assignment.setTeacher(teacher);
        assignment.setBatch(batch);

        // ensure attachments list initialized
        if (assignment.getAttachments() == null) {
            assignment.setAttachments(new ArrayList<>());
        }

        // persist initial assignment so we have an id for pathing if needed
        Assignment saved = assignmentRepo.save(assignment);

        // handle file upload (R2)
        if (attachments != null && !attachments.isEmpty()) {
            for (MultipartFile mf : attachments) {
                if (mf == null || mf.isEmpty()) continue;
                String url = storageService.uploadFile(mf); // returns URL string
                AssignmentAttachment att = new AssignmentAttachment();
                // assume your AssignmentAttachment has fields: fileName, contentType, url, size (or adapt)
                att.setFileName(Objects.requireNonNullElse(mf.getOriginalFilename(), "file"));
                // try both common fields: if entity uses 'url' use setUrl, else setFileUrl - try to match your entity
                try {
                    att.getClass().getMethod("setUrl", String.class).invoke(att, url);
                } catch (Exception e) {
                    // fallback to setFileUrl if present
                    try { att.getClass().getMethod("setFileUrl", String.class).invoke(att, url); } catch (Exception ex) { /* ignore */ }
                }
                att.setAssignment(saved);
                saved.getAttachments().add(att);
            }
            saved = assignmentRepo.save(saved);
        }

        return DtoMapper.toAssignmentDto(saved);
    }

    @Override
    public AssignmentDto updateAssignment(Long id, AssignmentRequest request, List<MultipartFile> attachments) {
        Assignment assignment = assignmentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));

        if (request.getTitle() != null) assignment.setTitle(request.getTitle());
        if (request.getDescription() != null) assignment.setDescription(request.getDescription());
        if (request.getStartDate() != null) assignment.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) assignment.setEndDate(request.getEndDate());
        if (request.getMaxMarks() != null) assignment.setMaxMarks(request.getMaxMarks());
        if (request.getStatus() != null) assignment.setStatus(request.getStatus());

        if (assignment.getAttachments() == null) assignment.setAttachments(new ArrayList<>());

        if (attachments != null && !attachments.isEmpty()) {
            for (MultipartFile mf : attachments) {
                if (mf == null || mf.isEmpty()) continue;
                String url = storageService.uploadFile(mf);
                AssignmentAttachment att = new AssignmentAttachment();
                att.setFileName(Objects.requireNonNullElse(mf.getOriginalFilename(), "file"));
                try {
                    att.getClass().getMethod("setUrl", String.class).invoke(att, url);
                } catch (Exception e) {
                    try { att.getClass().getMethod("setFileUrl", String.class).invoke(att, url); } catch (Exception ex) { /* ignore */ }
                }
                att.setAssignment(assignment);
                assignment.getAttachments().add(att);
            }
        }

        Assignment updated = assignmentRepo.save(assignment);
        return DtoMapper.toAssignmentDto(updated);
    }

    @Override
    public Page<AssignmentDto> getAssignmentsForTeacher(Long teacherId, Pageable p) {
        // Using repository to fetch all assignments for teacher and map to DTOs and create a Page
        List<Assignment> list = assignmentRepo.findByTeacherId(teacherId);
        List<AssignmentDto> dtos = new ArrayList<>();
        for (Assignment a : list) dtos.add(DtoMapper.toAssignmentDto(a));

        return new PageImpl<>(dtos, p, dtos.size());
    }

    @Override
    public List<AssignmentDto> getAssignmentsForBatch(Long batchId) {
        List<Assignment> list = assignmentRepo.findByBatchId(batchId);
        List<AssignmentDto> dtos = new ArrayList<>();
        for (Assignment a : list) dtos.add(DtoMapper.toAssignmentDto(a));
        return dtos;
    }

    @Override
    public AssignmentDto publishAssignment(Long id) {
        Assignment a = assignmentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Assignment not found"));
        a.setStatus(AssignmentStatus.PUBLISHED);
        return DtoMapper.toAssignmentDto(assignmentRepo.save(a));
    }

    @Override
    public AssignmentSubmissionDto submitAssignment(Long assignmentId, Long studentId, String textAnswer, List<MultipartFile> files) {
        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));
        User student = userRepo.findById(studentId).orElseThrow(() -> new IllegalArgumentException("Student not found"));

        AssignmentSubmission submission = submissionRepo.findByAssignmentIdAndStudentId(assignmentId, studentId)
                .orElseGet(() -> {
                    AssignmentSubmission s = new AssignmentSubmission();
                    s.setAssignment(assignment);
                    s.setStudent(student);
                    return s;
                });

        submission.setTextAnswer(textAnswer);
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(SubmissionStatus.SUBMITTED); 


        if (submission.getAttachments() == null) submission.setAttachments(new ArrayList<>());

        if (files != null && !files.isEmpty()) {
            // clear previous attachments to replace with new upload
            submission.getAttachments().clear();
            for (MultipartFile mf : files) {
                if (mf == null || mf.isEmpty()) continue;
                String url = storageService.uploadFile(mf);
                SubmissionAttachment att = new SubmissionAttachment();
                att.setFileName(Objects.requireNonNullElse(mf.getOriginalFilename(), "file"));
                try { att.getClass().getMethod("setUrl", String.class).invoke(att, url);
                } catch (Exception e) { try { att.getClass().getMethod("setFileUrl", String.class).invoke(att, url); } catch (Exception ex) { /* ignore */ } }
                att.setSubmission(submission);
                submission.getAttachments().add(att);
            }
        }

        AssignmentSubmission saved = submissionRepo.save(submission);
        return DtoMapper.toSubmissionDto(saved);
    }

    @Override
    public List<AssignmentSubmissionDto> listSubmissions(Long assignmentId) {
        List<AssignmentSubmission> list = submissionRepo.findByAssignmentId(assignmentId);
        List<AssignmentSubmissionDto> dtos = new ArrayList<>();
        for (AssignmentSubmission s : list) dtos.add(DtoMapper.toSubmissionDto(s));
        return dtos;
    }

    @Override
    public AssignmentSubmissionDto gradeSubmission(GradeRequest gradeRequest, Long teacherId) {
        AssignmentSubmission sub = submissionRepo.findById(gradeRequest.getSubmissionId())
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        if (sub.getAssignment() == null || sub.getAssignment().getTeacher() == null ||
            !teacherId.equals(sub.getAssignment().getTeacher().getId())) {
            throw new SecurityException("Not authorized to grade this submission");
        }

        sub.setMarksObtained(gradeRequest.getMarksObtained());
        sub.setTeacherRemarks(gradeRequest.getRemarks());
        sub.setStatus(SubmissionStatus.GRADED);

        AssignmentSubmission saved = submissionRepo.save(sub);
        return DtoMapper.toSubmissionDto(saved);
    }

    @Override
    public AssignmentSubmissionDto rejectSubmission(Long submissionId, String reason) {
        AssignmentSubmission sub = submissionRepo.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        sub.setStatus(SubmissionStatus.REJECTED);
        sub.setTeacherRemarks(reason);
        AssignmentSubmission saved = submissionRepo.save(sub);
        return DtoMapper.toSubmissionDto(saved);
    }

    @Override
    public void extendAssignmentDeadline(ExtendRequest req, Long teacherId) {
        Assignment a = assignmentRepo.findById(req.getAssignmentId())
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));
        if (a.getTeacher() == null || !teacherId.equals(a.getTeacher().getId())) {
            throw new SecurityException("Not authorized to extend deadline");
        }
        a.setEndDate(req.getNewEndDate());
        assignmentRepo.save(a);
    }

    @Override
    public Resource downloadSubmissionAttachment(Long attachmentId) {
        // Not implemented fully — requires storing path/identifier to request file from R2
        throw new UnsupportedOperationException("downloadSubmissionAttachment not implemented");
    }

    @Override
    public Resource bulkDownloadSubmissions(Long assignmentId) {
        // Not implemented here. Could be implemented by streaming attachments from R2 into a zip and returning as Resource.
        throw new UnsupportedOperationException("bulkDownloadSubmissions not implemented");
    }

    @Override
    public List<AssignmentDto> getAllAssignmentsByTeacher(Long teacherId) {
        List<Assignment> list = assignmentRepo.findByTeacherId(teacherId);
        List<AssignmentDto> dtos = new ArrayList<>();
        for (Assignment a : list) dtos.add(DtoMapper.toAssignmentDto(a));
        return dtos;
    }
    
    @Override
    public void deleteAssignment(Long assignmentId, Long teacherId) {
        Assignment a = assignmentRepo.findByIdAndTeacherId(assignmentId, teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found or not owned by you"));

        // delete all submissions and their attachments
        List<AssignmentSubmission> subs = submissionRepo.findByAssignmentId(assignmentId);
        submissionRepo.deleteAll(subs);

        // delete assignment (attachments cascade if mapped with orphanRemoval = true)
        assignmentRepo.delete(a);
    }
    
    @Override
    public List<AssignmentSubmissionDto> listSubmissionsByStudent(Long studentId) {
        List<AssignmentSubmission> list = submissionRepo.findByStudentId(studentId);
        return list.stream().map(DtoMapper::toSubmissionDto).toList();
    }
    
    @Override
    public AssignmentSubmissionDto getSubmissionForStudent(Long assignmentId, Long studentId) {
        return submissionRepo.findByAssignmentIdAndStudentId(assignmentId, studentId)
                .map(DtoMapper::toSubmissionDto)
                .orElseThrow(() -> new IllegalArgumentException("No submission found for this assignment"));
    }



}
