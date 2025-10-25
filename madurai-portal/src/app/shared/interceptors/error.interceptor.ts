import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Skip error handling for certain requests
        if (this.shouldSkipErrorHandling(req)) {
          return throwError(() => error);
        }

        // Handle different types of errors
        if (error.status === 401) {
          this.handleUnauthorized();
          return throwError(() => error);
        }

        if (error.status === 403) {
          this.handleForbidden();
          return throwError(() => error);
        }

        if (error.status === 404) {
          this.handleNotFound();
          return throwError(() => error);
        }

        // Handle all other errors
        this.errorHandler.handleHttpError(error, {
          component: this.extractComponentFromUrl(req.url),
          action: req.method
        });

        return throwError(() => error);
      })
    );
  }

  private shouldSkipErrorHandling(req: HttpRequest<any>): boolean {
    // Skip error handling for auth refresh requests to avoid infinite loops
    return req.url.includes('/auth/refresh') || 
           req.url.includes('/auth/login') ||
           req.url.includes('/auth/forgot-password');
  }

  private handleUnauthorized(): void {
    // This will be handled by the auth interceptor
    // Just log it here for completeness
    console.warn('Unauthorized access detected');
  }

  private handleForbidden(): void {
    this.errorHandler.showWarning(
      'You don\'t have permission to access this resource.',
      'Access Denied'
    );
  }

  private handleNotFound(): void {
    this.errorHandler.showWarning(
      'The requested resource was not found.',
      'Not Found'
    );
  }

  private extractComponentFromUrl(url: string): string {
    // Extract component name from URL for better error context
    const segments = url.split('/');
    const apiIndex = segments.findIndex(segment => segment === 'api');
    
    if (apiIndex !== -1 && segments[apiIndex + 1]) {
      return segments[apiIndex + 1];
    }
    
    return 'Unknown';
  }
}

