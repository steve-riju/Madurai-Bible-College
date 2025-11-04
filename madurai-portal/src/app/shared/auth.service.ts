import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  username: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        const normalizedRole = response.role.toLowerCase();

        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('userRole', normalizedRole);
        localStorage.setItem('username', response.username);
        localStorage.setItem('id', response.id.toString());
        localStorage.setItem('name', response.name);

        if (normalizedRole === 'student') {
          this.router.navigate(['/student/dashboard']);
        } else if (normalizedRole === 'teacher') {
          this.router.navigate(['/teacher/dashboard']);
        } else if (normalizedRole === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    this.router.navigate(['/auth/login']);
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getName(): string | null {
    return localStorage.getItem('name');
  }

  getId(): number | null {
    return Number(localStorage.getItem('id'));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // ✅ Fix: refreshToken() that returns just the new access token
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }),
      map((response) => response.accessToken)
    );
  }
}
