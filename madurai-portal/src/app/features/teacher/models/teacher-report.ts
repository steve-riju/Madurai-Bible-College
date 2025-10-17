export interface TeacherDailyReportDto {
  id?: number;
  teacherId?: number;
  teacherName?: string;
  batchId?: number;
  batchName?: string;
  semester?: string;
  date?: string; // ISO date string
  lessonCovered?: string;
  startTime?: string; // "HH:mm" or ISO time
  endTime?: string;   // "HH:mm" or ISO time
  assignmentsGiven?: string;
  additionalNotes?: string;
  createdAt?: string; // ISO datetime
}
