import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ErrorNotificationComponent } from './error-notification.component';

@NgModule({
  declarations: [
    ErrorNotificationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    ErrorNotificationComponent
  ]
})
export class ErrorNotificationModule { }

