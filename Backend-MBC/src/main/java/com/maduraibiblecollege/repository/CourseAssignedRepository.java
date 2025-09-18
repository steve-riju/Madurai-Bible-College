package com.maduraibiblecollege.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maduraibiblecollege.entity.CourseAssigned;

public interface CourseAssignedRepository extends JpaRepository<CourseAssigned, Long> {
	List<CourseAssigned> findByTeacherId(Long teacherId);

}

