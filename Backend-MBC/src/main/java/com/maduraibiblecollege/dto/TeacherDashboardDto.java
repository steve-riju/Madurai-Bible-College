package com.maduraibiblecollege.dto;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherDashboardDto {
    private long assignmentCount;
    private long materialCount;
    private long reportCount;
    private long batchCount;
    private List<String> recentAssignments;
    private List<TeacherBatchSummaryDto> myBatches;

}


