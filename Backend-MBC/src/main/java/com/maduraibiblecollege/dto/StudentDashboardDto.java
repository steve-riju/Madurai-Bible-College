package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardDto {
    private long courseCount;
    private long pendingAssignments;
    private long materialCount;
    private long noticeCount;

    private List<CourseInfo> myCourses;
    private List<AssignmentInfo> recentAssignments;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CourseInfo {
        private String name;
        private String semesterName;
        private String teacherName;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AssignmentInfo {
        private String title;
        private String dueDate;
    }
}

