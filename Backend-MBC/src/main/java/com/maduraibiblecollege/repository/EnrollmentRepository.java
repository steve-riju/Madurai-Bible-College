package com.maduraibiblecollege.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maduraibiblecollege.entity.CourseAssigned;
import com.maduraibiblecollege.entity.Enrollment;
import com.maduraibiblecollege.entity.User;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByCourseAssigned(CourseAssigned courseAssigned);
}
