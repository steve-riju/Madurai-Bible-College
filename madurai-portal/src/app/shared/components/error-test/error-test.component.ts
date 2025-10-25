import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorUtilsService } from '../../services/error-utils.service';

@Component({
  selector: 'app-error-test',
  template: `
    <div class="error-test-container">
      <h3>Error Handling Test</h3>
      
      <div class="button-group">
        <button mat-raised-button color="primary" (click)="testSuccess()">
          Test Success Message
        </button>
        
        <button mat-raised-button color="accent" (click)="testWarning()">
          Test Warning Message
        </button>
        
        <button mat-raised-button color="warn" (click)="testError()">
          Test Error Message
        </button>
        
        <button mat-raised-button (click)="testInfo()">
          Test Info Message
        </button>
      </div>
      
      <div class="button-group">
        <button mat-raised-button color="warn" (click)="testHttpError()">
          Test HTTP 404 Error
        </button>
        
        <button mat-raised-button color="warn" (click)="testHttp500Error()">
          Test HTTP 500 Error
        </button>
        
        <button mat-raised-button color="warn" (click)="testValidationError()">
          Test Validation Error
        </button>
      </div>
    </div>
  `,
  styles: [`
    .error-test-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .button-group {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    h3 {
      margin-bottom: 20px;
      color: #333;
    }
  `]
})
export class ErrorTestComponent {
  
  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtilsService
  ) {}

  testSuccess() {
    this.errorUtils.showSuccess('This is a success message!', 'Success');
  }

  testWarning() {
    this.errorUtils.showWarning('This is a warning message!', 'Warning');
  }

  testError() {
    this.errorUtils.handleError(new Error('This is a test error message'), {
      component: 'ErrorTestComponent',
      action: 'testError'
    });
  }

  testInfo() {
    this.errorUtils.showInfo('This is an info message!', 'Information');
  }

  testHttpError() {
    // This will trigger a 404 error
    this.http.get('/api/nonexistent-endpoint').subscribe({
      next: (data) => console.log(data),
      error: (err) => {
        // Error will be automatically handled by the interceptor
        console.log('HTTP 404 error triggered');
      }
    });
  }

  testHttp500Error() {
    // This will trigger a 500 error
    this.http.get('/api/error-test').subscribe({
      next: (data) => console.log(data),
      error: (err) => {
        // Error will be automatically handled by the interceptor
        console.log('HTTP 500 error triggered');
      }
    });
  }

  testValidationError() {
    // Simulate a validation error
    const validationError = {
      error: {
        timestamp: new Date().toISOString(),
        status: 400,
        error: 'Validation Failed',
        message: 'One or more fields are invalid.',
        path: '/api/test',
        details: [
          'Name is required',
          'Email format is invalid',
          'Age must be between 18 and 100'
        ]
      },
      status: 400,
      statusText: 'Bad Request'
    };

    this.errorUtils.handleHttpError(validationError as any, {
      component: 'ErrorTestComponent',
      action: 'testValidationError'
    });
  }
}

