import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ErrorNotification } from '../../models/error.model';

@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.scss']
})
export class ErrorNotificationComponent implements OnInit, OnDestroy {
  notifications: ErrorNotification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.errorHandler.getNotifications().subscribe(notifications => {
        this.notifications = notifications;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string): void {
    this.errorHandler.removeNotification(id);
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'check_circle';
      default:
        return 'info';
    }
  }

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }
}

