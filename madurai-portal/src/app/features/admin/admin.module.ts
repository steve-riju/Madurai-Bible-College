import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { CoursesComponent } from './courses/courses.component';
import { EventsComponent } from './events/events.component';
import { FaqsComponent } from './faqs/faqs.component';
import { SharedModule } from '../../shared/shared.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { EnrollmentsComponent } from './enrollments/enrollments.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { OfferingsComponent } from './offerings/offerings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    CoursesComponent,
    EventsComponent,
    FaqsComponent,
    AdminLayoutComponent,
    EnrollmentsComponent,
    AdmissionsComponent,
    OfferingsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
