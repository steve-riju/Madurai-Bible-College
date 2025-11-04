// features/admin/services/admin-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AdminDashboardDto {
  userStats: { students: number; teachers: number; admins: number };
  courseStats: { totalCourses: number; active: number; inactive: number };
  enrollmentStats: { current: number; previous: number };
  events: { title: string; date: string }[];
  admissions: { name: string; status: string }[];
  offerings: { donor: string; amount: number; date: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<AdminDashboardDto> {
    return this.http.get<AdminDashboardDto>(this.apiUrl);
  }
}
