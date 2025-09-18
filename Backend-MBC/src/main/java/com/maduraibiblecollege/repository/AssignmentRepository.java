package com.maduraibiblecollege.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.maduraibiblecollege.entity.assignmnets.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByBatchId(Long batchId);
    List<Assignment> findByTeacherId(Long teacherId);
    // add paging if needed
}




