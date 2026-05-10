import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdmissionForm, AdmissionSubmission } from '../../../shared/models/admission.model';

export interface AdmissionFormPayload {
  title: string;
  description: string;
  slug?: string;
  deadline: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminAdmissionsService {
  private apiUrl = `${environment.apiUrl}/api/admin/admissions`;

  constructor(private http: HttpClient) {}

  getForms(): Observable<AdmissionForm[]> {
    return this.http.get<AdmissionForm[]>(`${this.apiUrl}/forms`);
  }

  createForm(payload: AdmissionFormPayload): Observable<AdmissionForm> {
    return this.http.post<AdmissionForm>(`${this.apiUrl}/forms`, payload);
  }

  updateForm(id: number, payload: AdmissionFormPayload): Observable<AdmissionForm> {
    return this.http.put<AdmissionForm>(`${this.apiUrl}/forms/${id}`, payload);
  }

  updateDeadline(id: number, deadline: string): Observable<AdmissionForm> {
    return this.http.patch<AdmissionForm>(`${this.apiUrl}/forms/${id}/deadline`, { deadline });
  }

  updateActiveStatus(id: number, active: boolean): Observable<AdmissionForm> {
    return this.http.patch<AdmissionForm>(`${this.apiUrl}/forms/${id}/active`, { active });
  }

  archiveForm(id: number): Observable<AdmissionForm> {
    return this.http.delete<AdmissionForm>(`${this.apiUrl}/forms/${id}`);
  }

  getSubmissions(formId?: number): Observable<AdmissionSubmission[]> {
    const url = formId ? `${this.apiUrl}/submissions?formId=${formId}` : `${this.apiUrl}/submissions`;
    return this.http.get<AdmissionSubmission[]>(url);
  }

  getSubmission(id: number): Observable<AdmissionSubmission> {
    return this.http.get<AdmissionSubmission>(`${this.apiUrl}/submissions/${id}`);
  }

  updateSubmissionStatus(id: number, status: AdmissionSubmission['status']): Observable<AdmissionSubmission> {
    return this.http.patch<AdmissionSubmission>(`${this.apiUrl}/submissions/${id}/status`, { status });
  }
}
