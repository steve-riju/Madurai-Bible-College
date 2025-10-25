import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorUtilsService } from './error-utils.service';

@Injectable({
  providedIn: 'root'
})
export class ExampleUsageService {

  constructor(
    private http: HttpClient,
    private errorUtils: ErrorUtilsService
  ) {}

  /**
   * Example 1: Using the error interceptor (automatic error handling)
   * The error interceptor will automatically catch and display errors
   */
  getData(): Observable<any> {
    return this.http.get('/api/data');
  }

  /**
   * Example 2: Manual error handling with context
   */
  getDataWithContext(): Observable<any> {
    return this.errorUtils.handleHttpRequest(
      this.http.get('/api/data'),
      { component: 'ExampleComponent', action: 'getData' }
    );
  }

  /**
   * Example 3: Manual error handling for specific cases
   */
  getDataWithCustomHandling(): Observable<any> {
    return this.http.get('/api/data').pipe(
      // Custom error handling logic here if needed
      // The interceptor will still catch and display the error
    );
  }

  /**
   * Example 4: Showing success/warning messages
   */
  saveData(data: any): Observable<any> {
    return this.http.post('/api/data', data).pipe(
      // Success message will be shown by the component
      // Error will be handled by the interceptor
    );
  }

  /**
   * Example 5: Component usage
   */
  exampleComponentMethod() {
    // Show success message
    this.errorUtils.showSuccess('Operation completed successfully!');
    
    // Show warning message
    this.errorUtils.showWarning('Please check your input.');
    
    // Show info message
    this.errorUtils.showInfo('This is just an information message.');
  }
}

