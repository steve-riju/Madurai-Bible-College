import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherSubmissionReviewService {
  private baseUrl = 'http://localhost:8080/api/teacher/assignments'; 

  constructor(private http: HttpClient) {}

  listSubmissions(assignmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${assignmentId}/submissions`);
  }

 gradeSubmission(submissionId: number, marks: number, remarks: string): Observable<any> {
  const body = { marksObtained: marks, remarks: remarks };
  return this.http.put<any>(`${this.baseUrl}/submissions/${submissionId}/grade`, body);
}

rejectSubmission(submissionId: number, reason: string): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/submissions/${submissionId}/reject`, { reason });
}


  extendDeadline(assignmentId: number, newDate: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${assignmentId}/extend`, { newDeadline: newDate });
  }
}
