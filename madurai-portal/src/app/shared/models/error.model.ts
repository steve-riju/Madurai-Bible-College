export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: string[];
}

export interface ErrorNotification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  details?: string[];
  timestamp: Date;
  duration?: number; // Auto-dismiss duration in ms
}

export interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  timestamp: Date;
}


