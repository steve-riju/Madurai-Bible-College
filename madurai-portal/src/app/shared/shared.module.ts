import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ErrorNotificationModule } from './components/error-notification/error-notification.module';
import { ErrorTestModule } from './components/error-test/error-test.module';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    FilterPipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ErrorNotificationModule,
    ErrorTestModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    FilterPipe,
    SafeUrlPipe,
    ErrorNotificationModule,
    ErrorTestModule
  ]
})
export class SharedModule {}
