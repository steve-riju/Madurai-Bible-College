package com.maduraibiblecollege.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.maduraibiblecollege.entity.Semester;
@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {}

