import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Material {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  uploadedAt: string;
  courseId: number;
  courseName: string;
  uploadedBy: string;
}
@Injectable({
  providedIn: 'root'
})
export class TeacherMaterialsService {
  private apiUrl = 'http://localhost:8080/api/teacher/materials';

  constructor(private http: HttpClient) {}

  // 🔹 Fetch courses assigned to teacher by username
  getAssignedCourses(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assigned/teacher/username/${username}`);
  }

  // 🔹 Get all materials for a course
  getByCourse(courseId: number): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/course/${courseId}`);
  }

  // 🔹 Upload new material
  uploadMaterial(file: File, title: string, description: string, courseId: number, teacherUsername: string): Observable<Material> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('courseId', courseId.toString());
    formData.append('teacherUsername', teacherUsername);

    return this.http.post<Material>(this.apiUrl, formData);
  }

  // 🔹 Update existing material
  updateMaterial(id: number, title: string, description: string): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/${id}`, { title, description });
  }

  // 🔹 Delete material
  deleteMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
