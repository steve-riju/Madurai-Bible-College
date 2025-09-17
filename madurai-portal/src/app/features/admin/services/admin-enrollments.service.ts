import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BatchDto {
  id: number;
  name: string;
  semesterId?: string;
  courses?: string[];   // course names
  students?: string[];  // student usernames
  semesterName?: string;
}

export interface StudentDto {
  id: number;
  name: string;
}

export interface CourseDto {
  id: number;
  name: string;
}

export interface SemesterDto {
  id: number;
  name: string;
}

export interface EnrollmentDto {
  id: number;
  batch: BatchDto;
  student: StudentDto;
  course: CourseDto;
}

export interface BatchEnrollmentRequest {
  batchId: number;
  studentIds: number[];
  courseAssignedIds: number[]; 
}

export interface CreateBatchWithEnrollmentsRequest {
  batchId?: number;           // optional - if set uses existing batch
  name?: string;              // used when creating new batch
  semesterId?: string;        // used when creating new batch
  studentIds: number[];
  courseAssignedIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminEnrollmentsService {
  private apiUrl = 'http://localhost:8080/api/admin/enrollments';
  private batchApiUrl = 'http://localhost:8080/api/admin/batches';
  private semesterApiUrl = 'http://localhost:8080/api/admin/semesters';

  constructor(private http: HttpClient) {}

  getBatches(): Observable<BatchDto[]> {
    return this.http.get<BatchDto[]>(`${this.apiUrl}/batches`);
  }

  getStudents(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(`${this.apiUrl}/students`);
  }

  getCourses(): Observable<CourseDto[]> {
    return this.http.get<CourseDto[]>(`${this.apiUrl}/courses`);
  }

  getAllEnrollments(): Observable<EnrollmentDto[]> {
    return this.http.get<EnrollmentDto[]>(`${this.apiUrl}`);
  }

  createBatchWithEnrollments(req: CreateBatchWithEnrollmentsRequest): Observable<BatchDto> {
    return this.http.post<BatchDto>(`${this.batchApiUrl}/with-enrollments`, req);
  }

  removeEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteBatch(batchId: number): Observable<void> {
    return this.http.delete<void>(`${this.batchApiUrl}/${batchId}`);
  }

  getSemesters(): Observable<SemesterDto[]> {
    return this.http.get<SemesterDto[]>(`${this.semesterApiUrl}`);
  }
}
