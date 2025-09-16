import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id?: number;
  code: string;
  name: string;
  credits: number;
}

export interface Semester {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface CourseAssignment {
  id?: number;
  courseId: number;
  semesterId: number;
  teacherId: number;
  teacherName?: string;
}

export interface Teacher {
  id: number;
  username: string;
  email: string;
}


@Injectable({
  providedIn: 'root'
})
export class AdminCoursesService {
  // private apiUrl = 'http://192.168.1.6:8080/admin/courses';
  private apiUrl = 'http://localhost:8080/admin/courses';
  

  constructor(private http: HttpClient) {}

  // ---- Courses ----
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}`, course);
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ---- Semesters ----
  getSemesters(): Observable<Semester[]> {
    return this.http.get<Semester[]>(`${this.apiUrl}/semesters`);
  }

  createSemester(semester: Semester): Observable<Semester> {
    return this.http.post<Semester>(`${this.apiUrl}/semesters`, semester);
  }

  // ---- Assignments ----
  assignTeacher(dto: CourseAssignment): Observable<CourseAssignment> {
    return this.http.post<CourseAssignment>(`${this.apiUrl}/assign`, dto);
  }

  getAssignments(): Observable<CourseAssignment[]> {
    return this.http.get<CourseAssignment[]>(`${this.apiUrl}/assignments`);
  }

  getTeachers(): Observable<Teacher[]> {
  // return this.http.get<Teacher[]>('http://192.168.1.6:8080/api/admin/users/teachers');
  return this.http.get<Teacher[]>('http://localhost:8080/api/admin/users/teachers');
}

// ---- Semesters ----
deleteSemester(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/semesters/${id}`);
}

// ---- Assignments ----
deleteAssignment(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/assignments/${id}`);
}



}
