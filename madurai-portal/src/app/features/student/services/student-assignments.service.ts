// features/student/services/student-assignments.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssignmentDto, AssignmentSubmissionDto } from '../models/assignment';
import { BatchDto } from '../../teacher/assignments/assignments.component';

@Injectable({ providedIn: 'root' })
export class StudentAssignmentsService {
  private apiUrl = 'http://localhost:8080';
  private baseUrl = '/api/student/assignments';

  constructor(private http: HttpClient) {}


  getAssignmentsForBatch(batchId: number): Observable<AssignmentDto[]> {
    return this.http.get<AssignmentDto[]>(`${this.apiUrl}${this.baseUrl}/batch/${batchId}`);
  }

  submitAssignment(
    assignmentId: number,
    textAnswer: string | null,
    files?: File[]
  ): Observable<AssignmentSubmissionDto> {
    const form = new FormData();
    if (textAnswer) form.append('textAnswer', textAnswer);
    if (files && files.length) {
      for (let f of files) form.append('files', f, f.name);
    }
    return this.http.post<AssignmentSubmissionDto>(
      `${this.apiUrl}${this.baseUrl}/${assignmentId}/submit`,
      form
    );
  }

  getMySubmissions(): Observable<AssignmentSubmissionDto[]> {
    return this.http.get<AssignmentSubmissionDto[]>(`${this.apiUrl}${this.baseUrl}/my-submissions`);
  }

  getMySubmissionForAssignment(assignmentId: number): Observable<AssignmentSubmissionDto> {
    return this.http.get<AssignmentSubmissionDto>(
      `${this.apiUrl}${this.baseUrl}/${assignmentId}/my-submission`
    );
  }

  getMyBatches(): Observable<BatchDto[]> {
    return this.http.get<BatchDto[]>(`${this.apiUrl}/api/admin/batches/student/my-batches`);
  }
}
