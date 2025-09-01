package com.maduraibiblecollege.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maduraibiblecollege.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {}

