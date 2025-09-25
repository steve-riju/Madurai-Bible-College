import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherSubmissionReviewService {
  private baseUrl = 'http://localhost:8080/api/teacher/assignments'; // adjust if needed

  constructor(private http: HttpClient) {}

  listSubmissions(assignmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${assignmentId}/submissions`);
  }

  gradeSubmission(submissionId: number, body: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/submissions/${submissionId}/grade`, body);
  }

  rejectSubmission(submissionId: number, reason: string): Observable<any> {
    const body = { remarks: reason, marksObtained: 0 }; // backend can decide logic
    return this.http.put<any>(`${this.baseUrl}/submissions/${submissionId}/grade`, body);
  }

  extendDeadline(assignmentId: number, newDate: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${assignmentId}/extend`, { newDeadline: newDate });
  }
}
