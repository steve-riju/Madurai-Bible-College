import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldSkipAuth(req)) {
      return next.handle(req);
    }

    const token = this.authService.getAccessToken();
    let authReq = req;

    if (token) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handleUnauthorizedError(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url.includes('/auth/refresh') || !localStorage.getItem('refreshToken')) {
      this.authService.clearAuthState();
      this.router.navigate(['/auth/login'], { queryParams: { sessionExpired: true } });
      return throwError(() => new Error('Session expired, please re-login'));
    }

    return this.authService.refreshToken().pipe(
      switchMap((newToken: string) => {
        const newReq = request.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` }
        });
        return next.handle(newReq);
      }),
      catchError(() => {
        this.authService.clearAuthState();
        this.router.navigate(['/auth/login'], { queryParams: { sessionExpired: true } });
        return throwError(() => new Error('Session expired, please re-login'));
      })
    );
  }

  private shouldSkipAuth(req: HttpRequest<any>): boolean {
    const url = req.url.toLowerCase();
    return url.includes('/api/auth/login') ||
      url.includes('/api/auth/refresh') ||
      url.includes('/api/auth/forgot-password') ||
      url.includes('/api/auth/reset-password') ||
      url.includes('/api/public/');
  }
}
