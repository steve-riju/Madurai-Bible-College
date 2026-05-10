package com.maduraibiblecollege.repository;

import com.maduraibiblecollege.entity.AdmissionForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionFormRepository extends JpaRepository<AdmissionForm, Long> {
    Optional<AdmissionForm> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Long id);
    List<AdmissionForm> findByActiveTrueOrderByDeadlineAscTitleAsc();
    List<AdmissionForm> findAllByOrderByCreatedAtDesc();
}
