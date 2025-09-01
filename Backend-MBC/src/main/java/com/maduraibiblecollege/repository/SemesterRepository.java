package com.maduraibiblecollege.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maduraibiblecollege.entity.Semester;

public interface SemesterRepository extends JpaRepository<Semester, Long> {}

