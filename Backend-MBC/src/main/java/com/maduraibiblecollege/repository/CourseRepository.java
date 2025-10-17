package com.maduraibiblecollege.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.maduraibiblecollege.entity.Course;
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
	long countByActiveTrue();
    long countByActiveFalse();
}

