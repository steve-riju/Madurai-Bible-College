import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LeaveRequest, LeaveRequestPayload } from '../../../shared/models/leave.model';

@Injectable({ providedIn: 'root' })
export class StudentLeavesService {
  private apiUrl = `${environment.apiUrl}/api/student/leaves`;

  constructor(private http: HttpClient) {}

  applyLeave(payload: LeaveRequestPayload): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(this.apiUrl, payload);
  }

  getMyLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.apiUrl);
  }
}
