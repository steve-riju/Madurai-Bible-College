import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorUtilsService {

  constructor(private errorHandler: ErrorHandlerService) {}

  /**
   * Wrap HTTP observables with automatic error handling
   */
  handleHttpRequest<T>(
    request: Observable<T>,
    context?: { component: string; action: string }
  ): Observable<T> {
    return request.pipe(
      catchError(error => {
        this.errorHandler.handleHttpError(error, context);
        return throwError(() => error);
      })
    );
  }

  /**
   * Wrap any observable with error handling
   */
  handleRequest<T>(
    request: Observable<T>,
    context?: { component: string; action: string }
  ): Observable<T> {
    return request.pipe(
      catchError(error => {
        this.errorHandler.handleError(error, context);
        return throwError(() => error);
      })
    );
  }

  /**
   * Show success message
   */
  showSuccess(message: string, title?: string): void {
    this.errorHandler.showSuccess(message, title);
  }

  /**
   * Show warning message
   */
  showWarning(message: string, title?: string): void {
    this.errorHandler.showWarning(message, title);
  }

  /**
   * Show info message
   */
  showInfo(message: string, title?: string): void {
    this.errorHandler.showInfo(message, title);
  }

  /**
   * Handle HTTP errors directly
   */
  handleHttpError(error: any, context?: { component: string; action: string }): void {
    this.errorHandler.handleHttpError(error, context);
  }

  /**
   * Handle general errors directly
   */
  handleError(error: any, context?: { component: string; action: string }): void {
    this.errorHandler.handleError(error, context);
  }
}

