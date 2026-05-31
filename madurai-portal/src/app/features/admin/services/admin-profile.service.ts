import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  PageResponse,
  ProfileCardDto,
  StudentProfileDto,
  TeacherProfileDto
} from '../../../shared/models/profile.model';

export interface ProfileFilters {
  role?: string;
  name?: string;
  academicYear?: string;
  semester?: string;
  batch?: string;
  program?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminProfileService {
  private apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  getProfiles(
    filters: ProfileFilters,
    page = 0,
    size = 12,
    sort = 'id,asc'
  ): Observable<PageResponse<ProfileCardDto>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    if (filters.role) params = params.set('role', filters.role);
    if (filters.name) params = params.set('name', filters.name);
    if (filters.academicYear) params = params.set('academicYear', filters.academicYear);
    if (filters.semester) params = params.set('semester', filters.semester);
    if (filters.batch) params = params.set('batch', filters.batch);
    if (filters.program) params = params.set('program', filters.program);

    return this.http.get<PageResponse<ProfileCardDto>>(`${this.apiUrl}/profiles`, { params });
  }

  getPhoto(userId: number): Observable<Blob> {
  return this.http.get(
    `${environment.apiUrl}/api/profile/photo/${userId}`,
    {
      responseType: 'blob'
    }
  );
}

  getStudent(id: number): Observable<StudentProfileDto> {
    return this.http.get<StudentProfileDto>(`${this.apiUrl}/students/${id}`);
  }

  updateStudent(id: number, data: Partial<StudentProfileDto>): Observable<StudentProfileDto> {
    return this.http.put<StudentProfileDto>(`${this.apiUrl}/students/${id}`, data);
  }

  getTeacher(id: number): Observable<TeacherProfileDto> {
    return this.http.get<TeacherProfileDto>(`${this.apiUrl}/teachers/${id}`);
  }

  updateTeacher(id: number, data: Partial<TeacherProfileDto>): Observable<TeacherProfileDto> {
    return this.http.put<TeacherProfileDto>(`${this.apiUrl}/teachers/${id}`, data);
  }
}
