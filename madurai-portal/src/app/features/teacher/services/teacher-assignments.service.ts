import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AssignmentDto, BatchDto, SubmissionDto } from '../assignments/assignments.component';

@Injectable({ providedIn: 'root' })
export class TeacherAssignmentsService {
private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Teacher APIs
  createAssignment(formData: FormData) {
    return this.http.post<AssignmentDto>(`${this.apiUrl}/api/teacher/assignments`, formData);
  }
  getAssignmentsForBatch(batchId: number) {
    return this.http.get<AssignmentDto[]>(`${this.apiUrl}/api/teacher/assignments/batch/${batchId}`);
  }
  listSubmissions(assignmentId: number) {
    return this.http.get<SubmissionDto[]>(`${this.apiUrl}/api/teacher/assignments/${assignmentId}/submissions`);
  }
  gradeSubmission(submissionId: number, body: any) {
    return this.http.put(`${this.apiUrl}/api/teacher/assignments/submissions/${submissionId}/grade`, body);
  }
  extendDeadline(assignmentId: number, body: any) {
    return this.http.put(`${this.apiUrl}/api/teacher/assignments/${assignmentId}/extend`, body);
  }
  bulkDownload(assignmentId: number) {
    return this.http.get(`${this.apiUrl}/api/teacher/assignments/${assignmentId}/download-all`, { responseType: 'blob' });
  }

  // Student APIs
  getStudentAssignments() {
    return this.http.get<AssignmentDto[]>(`${this.apiUrl}/api/student/assignments`);
  }
  submitAssignment(assignmentId: number, formData: FormData) {
    return this.http.post(`${this.apiUrl}/api/student/assignments/${assignmentId}/submit`, formData);
  }
  getMySubmission(assignmentId: number) {
    return this.http.get<SubmissionDto>(`${this.apiUrl}/api/student/assignments/${assignmentId}/submission`);
  }

getBatches() {
  return this.http.get<BatchDto[]>(`${this.apiUrl}/api/teacher/assignments/batches`);
}

getAllAssignments() {
  return this.http.get<AssignmentDto[]>(`${this.apiUrl}/api/teacher/assignments`);
}


}
