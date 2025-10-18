export interface TeacherBatchSummaryDto {
  id: number;
  name: string;
  semesterName: string;
  totalStudents: number;
  semesterStartDate: string;
  semesterEndDate: string;
  currentSemester: Boolean;
}

export interface TeacherDashboardDto {
  assignmentCount: number;
  materialCount: number;
  reportCount: number;
  batchCount: number;
  recentAssignments: string[];
  myBatches: TeacherBatchSummaryDto[];
}
