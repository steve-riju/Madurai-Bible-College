import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiError, ErrorNotification, ErrorContext } from '../models/error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorNotifications$ = new BehaviorSubject<ErrorNotification[]>([]);
  private errorLog$ = new BehaviorSubject<ErrorContext[]>([]);

  constructor() {}

  /**
   * Handle HTTP errors and convert them to user-friendly messages
   */
  handleHttpError(error: HttpErrorResponse, context?: Partial<ErrorContext>): ErrorNotification {
    console.error('HTTP Error:', error);
    
    const apiError = this.extractApiError(error);
    const notification = this.createErrorNotification(apiError, context);
    
    this.addNotification(notification);
    this.logError(apiError, context);
    
    return notification;
  }

  /**
   * Handle general application errors
   */
  handleError(error: any, context?: Partial<ErrorContext>): ErrorNotification {
    console.error('Application Error:', error);
    
    const notification: ErrorNotification = {
      id: this.generateId(),
      type: 'error',
      title: 'Application Error',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date(),
      duration: 5000
    };
    
    this.addNotification(notification);
    this.logError(error, context);
    
    return notification;
  }

  /**
   * Show success notification
   */
  showSuccess(message: string, title: string = 'Success', duration: number = 4000): void {
    const notification: ErrorNotification = {
      id: this.generateId(),
      type: 'success',
      title,
      message,
      timestamp: new Date(),
      duration
    };
    
    this.addNotification(notification);
  }

  /**
   * Show warning notification
   */
  showWarning(message: string, title: string = 'Warning', duration: number = 5000): void {
    const notification: ErrorNotification = {
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      timestamp: new Date(),
      duration
    };
    
    this.addNotification(notification);
  }

  /**
   * Show info notification
   */
  showInfo(message: string, title: string = 'Information', duration: number = 4000): void {
    const notification: ErrorNotification = {
      id: this.generateId(),
      type: 'info',
      title,
      message,
      timestamp: new Date(),
      duration
    };
    
    this.addNotification(notification);
  }

  /**
   * Get current notifications
   */
  getNotifications(): Observable<ErrorNotification[]> {
    return this.errorNotifications$.asObservable();
  }

  /**
   * Get error log
   */
  getErrorLog(): Observable<ErrorContext[]> {
    return this.errorLog$.asObservable();
  }

  /**
   * Remove notification by ID
   */
  removeNotification(id: string): void {
    const current = this.errorNotifications$.value;
    const updated = current.filter(n => n.id !== id);
    this.errorNotifications$.next(updated);
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.errorNotifications$.next([]);
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog$.next([]);
  }

  private extractApiError(error: HttpErrorResponse): ApiError {
    if (error.error && typeof error.error === 'object') {
      return {
        timestamp: error.error.timestamp || new Date().toISOString(),
        status: error.status,
        error: error.error.error || this.getStatusText(error.status),
        message: error.error.message || error.message || 'An error occurred',
        path: error.error.path || error.url || '',
        details: error.error.details || []
      };
    }

    return {
      timestamp: new Date().toISOString(),
      status: error.status,
      error: this.getStatusText(error.status),
      message: error.message || 'An error occurred',
      path: error.url || '',
      details: []
    };
  }

  private createErrorNotification(apiError: ApiError, context?: Partial<ErrorContext>): ErrorNotification {
    const userFriendlyMessage = this.getUserFriendlyMessage(apiError);
    
    return {
      id: this.generateId(),
      type: this.getNotificationType(apiError.status),
      title: this.getNotificationTitle(apiError),
      message: userFriendlyMessage,
      details: apiError.details,
      timestamp: new Date(apiError.timestamp),
      duration: this.getNotificationDuration(apiError.status)
    };
  }

  private getUserFriendlyMessage(apiError: ApiError): string {
    // Map common backend errors to user-friendly messages
    const errorMappings: { [key: string]: string } = {
      'Validation Failed': 'Please check your input and try again.',
      'Data Integrity Violation': 'This action cannot be completed because the item is linked to other records.',
      'Not Found': 'The requested resource was not found.',
      'Access Denied': 'You don\'t have permission to perform this action.',
      'JWT Authentication Failed': 'Your session has expired. Please log in again.',
      'Business Error': apiError.message,
      'Validation Error': apiError.message,
      'Invalid State': apiError.message
    };

    // Check for specific error patterns
    if (apiError.message?.includes('SQLIntegrityConstraintViolationException')) {
      return 'This item cannot be deleted because it is linked with other records.';
    }
    
    if (apiError.message?.includes('ConstraintViolationException')) {
      return 'Invalid input. Please check the values and try again.';
    }
    
    if (apiError.message?.includes('Username already exists')) {
      return 'This username is already taken. Please choose a different one.';
    }
    
    if (apiError.message?.includes('Email already exists')) {
      return 'This email is already registered. Please use a different email.';
    }
    
    if (apiError.message?.includes('User is not a teacher')) {
      return 'Selected user is not a teacher.';
    }

    // Return mapped message or original message
    return errorMappings[apiError.error] || apiError.message || 'Something went wrong. Please try again.';
  }

  private getNotificationType(status: number): 'error' | 'warning' | 'info' | 'success' {
    if (status >= 500) return 'error';
    if (status >= 400) return 'warning';
    if (status >= 300) return 'info';
    return 'success';
  }

  private getNotificationTitle(apiError: ApiError): string {
    const titleMappings: { [key: string]: string } = {
      'Validation Failed': 'Validation Error',
      'Data Integrity Violation': 'Cannot Delete',
      'Not Found': 'Not Found',
      'Access Denied': 'Access Denied',
      'JWT Authentication Failed': 'Session Expired',
      'Business Error': 'Error',
      'Validation Error': 'Validation Error',
      'Invalid State': 'Invalid Operation'
    };

    return titleMappings[apiError.error] || 'Error';
  }

  private getNotificationDuration(status: number): number {
    if (status >= 500) return 8000; // Server errors - longer duration
    if (status >= 400) return 6000; // Client errors - medium duration
    return 4000; // Success/info - shorter duration
  }

  private getStatusText(status: number): string {
    const statusTexts: { [key: number]: string } = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable'
    };

    return statusTexts[status] || 'Unknown Error';
  }

  private addNotification(notification: ErrorNotification): void {
    const current = this.errorNotifications$.value;
    this.errorNotifications$.next([...current, notification]);

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  private logError(error: any, context?: Partial<ErrorContext>): void {
    const errorContext: ErrorContext = {
      component: context?.component || 'Unknown',
      action: context?.action || 'Unknown',
      userId: context?.userId,
      timestamp: new Date()
    };

    const current = this.errorLog$.value;
    this.errorLog$.next([...current, errorContext]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

