import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdmissionForm, AdmissionSubmission, AdmissionSubmissionRequest } from '../../../shared/models/admission.model';

@Injectable({ providedIn: 'root' })
export class PublicAdmissionsService {
  private apiUrl = `${environment.apiUrl}/api/public/admissions`;

  constructor(private http: HttpClient) {}

  getForms(): Observable<AdmissionForm[]> {
    return this.http.get<AdmissionForm[]>(`${this.apiUrl}/forms`);
  }

  getForm(idOrSlug: string): Observable<AdmissionForm> {
    return this.http.get<AdmissionForm>(`${this.apiUrl}/forms/${idOrSlug}`);
  }

  submitApplication(payload: AdmissionSubmissionRequest): Observable<AdmissionSubmission> {
    return this.http.post<AdmissionSubmission>(`${this.apiUrl}/submit`, payload);
  }
}
