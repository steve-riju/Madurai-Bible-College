package com.maduraibiblecollege.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.maduraibiblecollege.entity.Batch;
import com.maduraibiblecollege.entity.CourseAssigned;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
 List<Batch> findByNameContainingIgnoreCase(String name);
 Optional<Batch> findByNameAndSemesterId(String name, String semesterId);
 boolean existsByNameAndSemesterId(String name, String semesterId);
 List<Batch> findByCourses_Id(Long courseAssignedId);
}
