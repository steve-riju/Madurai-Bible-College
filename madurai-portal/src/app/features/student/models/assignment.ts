// features/student/models/assignment.model.ts
export interface AssignmentDto {
  id: number;
  title: string;
  description?: string;
  deadline?: string;  // ISO
  maxMarks?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  batchId?: number;
  attachments?: AssignmentAttachmentDto[];
  teacherName?: string;
  submitted?: boolean;
  submission?: AssignmentSubmissionDto;
}



export interface AssignmentAttachmentDto {
  id?: number;
  fileUrl?: string;
  fileName?: string;
  contentType?: string;
}

export interface AssignmentSubmissionDto {
  id?: number;
  assignmentId: number;
  assignmentTitle?: string; 
  batchId?: number;         
  batchName?: string;       
  studentId?: number;
  studentName?: string;
  textAnswer?: string;
  submittedAt?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'REJECTED' | 'GRADED';
  marksObtained?: number;
  teacherRemarks?: string;
  attemptNumber?: number;
  attachments?: { fileName: string; fileUrl: string }[]; // student-uploaded
  teacherAttachments?: { fileName: string; fileUrl: string }[]; // teacher-uploaded

}

export interface SubmissionAttachmentDto {
  id?: number;
  fileUrl?: string;
  fileName?: string;
  contentType?: string;
}
