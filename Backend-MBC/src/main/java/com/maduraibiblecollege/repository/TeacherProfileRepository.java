package com.maduraibiblecollege.repository;

import com.maduraibiblecollege.entity.TeacherProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, Long> {
    Optional<TeacherProfile> findByUserId(Long userId);
    Optional<TeacherProfile> findByUserUsername(String username);
}
