import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StudentRoutingModule } from './student-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoursesComponent } from './courses/courses.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../../shared/shared.module';
import { StudentLayoutComponent } from './student-layout/student-layout.component';
import { MatIcon } from '@angular/material/icon';
import { MaterialsComponent } from './materials/materials.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CoursesComponent,
    AssignmentsComponent,
    EventsComponent,
    ProfileComponent,
    StudentLayoutComponent,
    MaterialsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    StudentRoutingModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIcon
  ]
})
export class StudentModule { }
