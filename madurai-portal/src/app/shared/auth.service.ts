import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: 'student' | 'teacher' | 'admin' | null = null;

  constructor(private router: Router) {}

  // ✅ simulate login
  login(role: 'student' | 'teacher' | 'admin'): void {
    this.userRole = role;
    localStorage.setItem('userRole', role);

    // redirect after login
    if (role === 'student') {
      this.router.navigate(['/student/dashboard']);
    } else if (role === 'teacher') {
      this.router.navigate(['/teacher/dashboard']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  // ✅ get current role
  getUserRole(): string | null {
    if (!this.userRole) {
      this.userRole = localStorage.getItem('userRole') as 'student' | 'teacher' | 'admin' | null;
    }
    return this.userRole;
  }

  // ✅ logout
  logout(): void {
    this.userRole = null;
    localStorage.removeItem('userRole');
    this.router.navigate(['/auth/login']);
  }

  // ✅ check login status
  isLoggedIn(): boolean {
    return this.getUserRole() !== null;
  }
}
