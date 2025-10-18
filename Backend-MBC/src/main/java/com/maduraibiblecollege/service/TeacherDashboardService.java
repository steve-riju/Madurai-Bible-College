package com.maduraibiblecollege.service;

import com.maduraibiblecollege.dto.TeacherDashboardDto;

public interface TeacherDashboardService {
    TeacherDashboardDto getDashboardData(Long teacherId);
}


