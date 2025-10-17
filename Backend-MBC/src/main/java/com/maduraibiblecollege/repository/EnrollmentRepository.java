package com.maduraibiblecollege.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.maduraibiblecollege.entity.Batch;
import com.maduraibiblecollege.entity.CourseAssigned;
import com.maduraibiblecollege.entity.Enrollment;
import com.maduraibiblecollege.entity.User;
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByCourseAssigned(CourseAssigned courseAssigned);
    long count();

    long countByBatchId(Long batchId);

    // If your Enrollment has a 'enrolledAt' field:
    long countByEnrolledAtBetween(LocalDateTime start, LocalDateTime end);
	long deleteAllByBatch(Batch batch);


}
