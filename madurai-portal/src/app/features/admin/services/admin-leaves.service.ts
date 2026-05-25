import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LeaveActionPayload, LeaveRequest, LeaveStatus, PageResponse } from '../../../shared/models/leave.model';

@Injectable({ providedIn: 'root' })
export class AdminLeavesService {
  private apiUrl = `${environment.apiUrl}/api/admin/leaves`;

  constructor(private http: HttpClient) {}

  getLeaves(
    status: LeaveStatus | '' = '',
    page = 0,
    size = 10,
    sort = 'appliedDate,desc'
  ): Observable<PageResponse<LeaveRequest>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse<LeaveRequest>>(this.apiUrl, { params });
  }

  approveLeave(id: number, payload: LeaveActionPayload): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}/approve`, payload);
  }

  rejectLeave(id: number, payload: LeaveActionPayload): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}/reject`, payload);
  }
}
