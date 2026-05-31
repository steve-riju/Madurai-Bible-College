import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  ChangePasswordRequest,
  StudentProfileDto,
  TeacherProfileDto,
  UserProfileDto
} from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/api/profile`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<StudentProfileDto | TeacherProfileDto | UserProfileDto> {
    return this.http.get<StudentProfileDto | TeacherProfileDto | UserProfileDto>(`${this.apiUrl}/me`);
  }

  updateMyProfile(data: Partial<StudentProfileDto>): Observable<StudentProfileDto> {
    return this.http.put<StudentProfileDto>(`${this.apiUrl}/me`, data);
  }

  updateMyTeacherProfile(data: Partial<TeacherProfileDto>): Observable<TeacherProfileDto> {
    return this.http.put<TeacherProfileDto>(`${this.apiUrl}/me/teacher`, data);
  }

  uploadPhoto(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.apiUrl}/photo`, formData);
  }

  getPhotoUrl(userId: number): string {
    return `${this.apiUrl}/photo/${userId}`;
  }

  getPhoto(userId: number): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/photo/${userId}?t=${Date.now()}`,
    { responseType: 'blob' }
  );
}
  changePassword(payload: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/change-password`, payload);
  }
}
