import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LeaveRequest, LeaveRequestPayload, PageResponse } from '../../../shared/models/leave.model';

@Injectable({ providedIn: 'root' })
export class StudentLeavesService {
  private apiUrl = `${environment.apiUrl}/api/leaves`;

  constructor(private http: HttpClient) {}

  applyLeave(payload: LeaveRequestPayload): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}/apply`, payload);
  }

  getMyLeaves(page = 0, size = 10, sort = 'appliedDate,desc'): Observable<PageResponse<LeaveRequest>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<PageResponse<LeaveRequest>>(`${this.apiUrl}/my-leaves`, { params });
  }
}
