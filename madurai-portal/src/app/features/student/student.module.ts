import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MaterialsComponent } from './materials/materials.component';
import { AssignmentSubmitDialogComponent } from './assignment-submit-dialog/assignment-submit-dialog.component';
import { MySubmissionsComponent } from './my-submissions/my-submissions.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@NgModule({
  declarations: [
    DashboardComponent,
    CoursesComponent,
    AssignmentsComponent,
    EventsComponent,
    ProfileComponent,
    StudentLayoutComponent,
    MaterialsComponent,
    AssignmentSubmitDialogComponent,
    MySubmissionsComponent
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
    MatIcon,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatOption,
    MatSelect
  ]
})
export class StudentModule { }
