package com.maduraibiblecollege.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.maduraibiblecollege.entity.Material;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCourseId(Long courseId);
    List<Material> findByTeacherId(Long teacherId);
	long countByTeacherId(Long teacherId);
}


