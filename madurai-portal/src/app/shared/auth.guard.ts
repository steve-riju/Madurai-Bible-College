import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
  const expectedRole = route.data['role'];
  const userRole = this.authService.getUserRole();
  const token = localStorage.getItem('accessToken');

  if (token && userRole === expectedRole) {
    return true;
  } else {
    this.router.navigate(['/auth/login']);
    return false;
  }
}

}
