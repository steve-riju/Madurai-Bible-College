// src/app/features/admin/services/admin-users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface User {
  id?: number;
  username: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface ApiResponse {
  message: string;
  success: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private apiUrl = `${environment.apiUrl}/api/admin/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, user);
  }

  deleteUser(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }


  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

    getStudents(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/students`);
}

getTeachers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/teachers`);
}

}
