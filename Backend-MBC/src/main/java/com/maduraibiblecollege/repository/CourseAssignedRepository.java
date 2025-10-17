package com.maduraibiblecollege.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.maduraibiblecollege.entity.CourseAssigned;
@Repository
public interface CourseAssignedRepository extends JpaRepository<CourseAssigned, Long> {
	List<CourseAssigned> findByTeacherId(Long teacherId);
}

