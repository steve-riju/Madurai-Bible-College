import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LeaveActionPayload, LeaveRequest, LeaveStatus } from '../../../shared/models/leave.model';

@Injectable({ providedIn: 'root' })
export class AdminLeavesService {
  private apiUrl = `${environment.apiUrl}/api/admin/leaves`;

  constructor(private http: HttpClient) {}

  getLeaves(status?: LeaveStatus | ''): Observable<LeaveRequest[]> {
    const url = status ? `${this.apiUrl}?status=${status}` : this.apiUrl;
    return this.http.get<LeaveRequest[]>(url);
  }

  approveLeave(id: number, payload: LeaveActionPayload): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}/approve`, payload);
  }

  rejectLeave(id: number, payload: LeaveActionPayload): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}/reject`, payload);
  }
}
