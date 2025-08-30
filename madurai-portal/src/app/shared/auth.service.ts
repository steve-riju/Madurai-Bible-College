import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  username: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.1.6:8080/api/auth'; // 🔹 Spring Boot backend

  constructor(private router: Router, private http: HttpClient) {}

  // ✅ Login with backend
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
  const normalizedRole = response.role.toLowerCase(); // 🔹 convert to lowercase

  // Store tokens
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  localStorage.setItem('userRole', normalizedRole);
  localStorage.setItem('username', response.username);

  // Redirect by role
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

  // ✅ Logout
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    this.router.navigate(['/auth/login']);
  }

  // ✅ Get role from localStorage
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Get username from localStorage
 getUsername(): string | null {
  return localStorage.getItem('username');
}


 isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  refresh(refreshToken: string) {
  return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken });
}

}
