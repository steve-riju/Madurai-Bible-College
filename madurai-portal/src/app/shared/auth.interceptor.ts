import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');
    let authReq = req;

    if (token) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        // Expired or invalid token
        if (error instanceof HttpErrorResponse && error.status === 403) {
          return this.handle403Error(authReq, next);
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

  private handle403Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        return this.authService.refresh(refreshToken).pipe(
          switchMap((res) => {
            this.isRefreshing = false;
            localStorage.setItem('accessToken', res.accessToken);
            this.refreshTokenSubject.next(res.accessToken);
            return next.handle(this.addTokenHeader(req, res.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authService.logout(); // force logout if refresh fails
            return throwError(() => err);
          })
        );
      }
    }

    // Wait until refresh finishes, then retry
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(req, token!)))
    );
  }
}
