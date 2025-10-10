import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeacherSubmissionReviewService {
  private baseUrl = 'http://localhost:8080/api/teacher/assignments';

  constructor(private http: HttpClient) {}

  listSubmissions(assignmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${assignmentId}/submissions`);
  }

  getAssignment(assignmentId: number): Observable<any> {
    // fallback: if backend doesn't have this endpoint, it may 404 and caller handles error
    return this.http.get<any>(`${this.baseUrl}/${assignmentId}`);
  }

  gradeSubmission(submissionId: number, marks: number, remarks: string) {
    const body = { marksObtained: marks, remarks: remarks };
    return this.http.put<any>(`${this.baseUrl}/submissions/${submissionId}/grade`, body);
  }

  rejectSubmission(submissionId: number, reason: string) {
    return this.http.put<any>(`${this.baseUrl}/submissions/${submissionId}/reject`, { reason });
  }

  bulkDownload(assignmentId: number) {
    // returns blob (zip). Ensure backend sets correct headers & CORS.
    return this.http.get(`${this.baseUrl}/${assignmentId}/download-all`, { responseType: 'blob' });
  }

  extendDeadline(assignmentId: number, newDate: string) {
    return this.http.put<any>(`${this.baseUrl}/${assignmentId}/extend`, { newDeadline: newDate });
  }
}
