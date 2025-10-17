// teacher-reports.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TeacherDailyReportDto } from '../models/teacher-report';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeacherReportsService {
  private apiUrl = 'http://localhost:8080/api/teacher/reports';

  constructor(private http: HttpClient) {}

  submitReport(dto: Partial<TeacherDailyReportDto>): Observable<TeacherDailyReportDto> {
    return this.http.post<TeacherDailyReportDto>(this.apiUrl, dto);
  }

  getAllReports(): Observable<TeacherDailyReportDto[]> {
    return this.http.get<TeacherDailyReportDto[]>(this.apiUrl);
  }

  getReportsByTeacher(teacherId: number): Observable<TeacherDailyReportDto[]> {
    return this.http.get<TeacherDailyReportDto[]>(`${this.apiUrl}/teacher/${teacherId}`);
  }

}
