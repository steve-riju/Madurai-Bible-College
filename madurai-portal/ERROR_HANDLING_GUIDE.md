# Error Handling System Guide

This guide explains how to use the comprehensive error handling system implemented in the Madurai Bible College application.

## Overview

The error handling system provides:
- **Centralized error processing** - All HTTP errors are caught and processed consistently
- **User-friendly error messages** - Backend errors are mapped to readable messages
- **Visual notifications** - Toast-style notifications appear in the top-right corner
- **Error logging** - All errors are logged for debugging purposes
- **Contextual information** - Errors include component and action context

## Architecture

### Backend (Spring Boot)
- `GlobalExceptionHandler` - Catches all exceptions and returns consistent `ApiError` format
- Custom exception classes: `BusinessException`, `ResourceNotFoundException`, `ValidationException`
- Consistent error response structure with timestamp, status, error type, message, and details

### Frontend (Angular)
- `ErrorInterceptor` - Catches all HTTP errors automatically
- `ErrorHandlerService` - Centralized error processing and notification management
- `ErrorUtilsService` - Utility service for easy error handling in components
- `ErrorNotificationComponent` - Visual notification display

## Usage

### 1. Automatic Error Handling (Recommended)

The error interceptor automatically catches and displays all HTTP errors. No additional code needed:

```typescript
// This will automatically show error notifications if the request fails
this.http.get('/api/data').subscribe(data => {
  // Handle success
});
```

### 2. Manual Error Handling with Context

For better error tracking, provide context information:

```typescript
import { ErrorUtilsService } from '../shared/services/error-utils.service';

constructor(private errorUtils: ErrorUtilsService) {}

// Method 1: Using the utility service
this.errorUtils.handleHttpRequest(
  this.http.get('/api/data'),
  { component: 'MyComponent', action: 'loadData' }
).subscribe(data => {
  // Handle success
});

// Method 2: Manual handling
this.http.get('/api/data').subscribe({
  next: (data) => {
    // Handle success
  },
  error: (err) => {
    this.errorUtils.handleError(err, { 
      component: 'MyComponent', 
      action: 'loadData' 
    });
  }
});
```

### 3. Showing Success/Warning Messages

```typescript
// Success message
this.errorUtils.showSuccess('Data saved successfully!');

// Warning message
this.errorUtils.showWarning('Please check your input.');

// Info message
this.errorUtils.showInfo('This is just an information message.');
```

### 4. Component Integration

```typescript
import { Component } from '@angular/core';
import { ErrorUtilsService } from '../shared/services/error-utils.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  constructor(private errorUtils: ErrorUtilsService) {}

  saveData() {
    this.http.post('/api/save', this.data).subscribe({
      next: () => {
        this.errorUtils.showSuccess('Data saved successfully!');
      },
      error: (err) => {
        // Error will be automatically handled by the interceptor
        // But you can add additional handling here if needed
        console.log('Additional error handling:', err);
      }
    });
  }
}
```

## Error Types and Messages

### Backend Error Mapping

The system automatically maps backend errors to user-friendly messages:

| Backend Error | User Message |
|---------------|--------------|
| `Validation Failed` | "Please check your input and try again." |
| `Data Integrity Violation` | "This action cannot be completed because the item is linked to other records." |
| `Not Found` | "The requested resource was not found." |
| `Access Denied` | "You don't have permission to perform this action." |
| `JWT Authentication Failed` | "Your session has expired. Please log in again." |
| `Username already exists` | "This username is already taken. Please choose a different one." |
| `Email already exists` | "This email is already registered. Please use a different email." |

### Notification Types

- **Error** (Red) - Server errors (500+), critical issues
- **Warning** (Orange) - Client errors (400+), validation issues
- **Info** (Blue) - Informational messages
- **Success** (Green) - Successful operations

## Customization

### Adding New Error Mappings

Edit `ErrorHandlerService.getUserFriendlyMessage()` to add new error mappings:

```typescript
private getUserFriendlyMessage(apiError: ApiError): string {
  const errorMappings: { [key: string]: string } = {
    // Add your custom mappings here
    'CustomError': 'Your custom user-friendly message',
    // ... existing mappings
  };
  
  return errorMappings[apiError.error] || apiError.message || 'Something went wrong.';
}
```

### Customizing Notification Duration

Edit `ErrorHandlerService.getNotificationDuration()`:

```typescript
private getNotificationDuration(status: number): number {
  if (status >= 500) return 10000; // Server errors - 10 seconds
  if (status >= 400) return 8000;  // Client errors - 8 seconds
  return 5000; // Success/info - 5 seconds
}
```

## Best Practices

1. **Use automatic error handling** - Let the interceptor handle most errors
2. **Provide context** - Always include component and action context for better debugging
3. **Show success messages** - Inform users when operations complete successfully
4. **Use appropriate message types** - Error for failures, warning for validation issues, info for general messages
5. **Don't duplicate error handling** - Avoid handling the same error in multiple places

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Check if `ErrorNotificationComponent` is included in your template
   - Verify the error interceptor is registered in `app.module.ts`

2. **Errors not being caught**
   - Ensure the error interceptor is registered after the auth interceptor
   - Check if the request URL is being skipped by `shouldSkipErrorHandling()`

3. **Duplicate error messages**
   - Avoid manual error handling when using the interceptor
   - Use `ErrorUtilsService` for consistent error handling

### Debug Mode

Enable debug logging by checking the browser console. All errors are logged with full context information.

## Migration from Old Error Handling

### Before (Old Way)
```typescript
this.service.getData().subscribe({
  next: (data) => {
    this.data = data;
  },
  error: (err) => {
    console.error('Error:', err);
    this.errorMsg = 'Something went wrong.';
    setTimeout(() => this.errorMsg = '', 5000);
  }
});
```

### After (New Way)
```typescript
// Option 1: Automatic (recommended)
this.service.getData().subscribe(data => {
  this.data = data;
});

// Option 2: With context
this.errorUtils.handleHttpRequest(
  this.service.getData(),
  { component: 'MyComponent', action: 'loadData' }
).subscribe(data => {
  this.data = data;
});
```

The new system provides better user experience, consistent error handling, and easier maintenance.

