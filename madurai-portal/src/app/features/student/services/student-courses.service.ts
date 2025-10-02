import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentCourse {
  id: number;
  code: string;
  name: string;
  credits: number;
  semester: string;
  teacherName: string;
  batchName: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentCoursesService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<StudentCourse[]> {
    return this.http.get<StudentCourse[]>(`${this.apiUrl}/api/student/courses`);
  }

  getCourseMaterials(courseId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/student/courses/${courseId}/materials`);
}

}
