package com.maduraibiblecollege.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.maduraibiblecollege.entity.assignmnets.AssignmentSubmission;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
    List<AssignmentSubmission> findByStudentId(Long studentId);
    
 // 🧮 Count pending/ungraded submissions for a teacher
    @Query("""
        SELECT COUNT(s)
        FROM AssignmentSubmission s
        WHERE s.assignment.teacher.id = :teacherId
          AND (s.status = 'SUBMITTED' OR s.status = 'REJECTED')
    """)
    long countPendingSubmissionsForTeacher(@Param("teacherId") Long teacherId);
}

