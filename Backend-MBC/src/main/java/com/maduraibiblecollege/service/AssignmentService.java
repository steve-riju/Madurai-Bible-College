package com.maduraibiblecollege.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.maduraibiblecollege.dto.AssignmentDto;
import com.maduraibiblecollege.dto.AssignmentRequest;
import com.maduraibiblecollege.dto.AssignmentSubmissionDto;
import com.maduraibiblecollege.dto.ExtendRequest;
import com.maduraibiblecollege.dto.GradeRequest;
import com.maduraibiblecollege.entity.User;

import org.springframework.core.io.Resource;
public interface AssignmentService {
    AssignmentDto createAssignment(AssignmentRequest request, List<MultipartFile> attachments, User teacher);
    AssignmentDto updateAssignment(Long id, AssignmentRequest request, List<MultipartFile> attachments);
    Page<AssignmentDto> getAssignmentsForTeacher(Long teacherId, Pageable p);
    List<AssignmentDto> getAssignmentsForBatch(Long batchId);
    AssignmentDto publishAssignment(Long id);
    AssignmentSubmissionDto submitAssignment(Long assignmentId, Long studentId, String textAnswer, List<MultipartFile> files);
    List<AssignmentSubmissionDto> listSubmissions(Long assignmentId);
    AssignmentSubmissionDto gradeSubmission(GradeRequest gradeRequest, Long teacherId);
    AssignmentSubmissionDto rejectSubmission(Long submissionId, String reason);
    void extendAssignmentDeadline(ExtendRequest req, Long teacherId);
    Resource downloadSubmissionAttachment(Long attachmentId); // for teacher download
    Resource bulkDownloadSubmissions(Long assignmentId);
    List<AssignmentDto> getAllAssignmentsByTeacher(Long teacherId);
    void deleteAssignment(Long assignmentId, Long teacherId);
	List<AssignmentSubmissionDto> listSubmissionsByStudent(Long studentId);
	AssignmentSubmissionDto getSubmissionForStudent(Long assignmentId, Long studentId);

}

