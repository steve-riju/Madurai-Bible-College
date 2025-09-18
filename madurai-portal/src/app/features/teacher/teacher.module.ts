import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialsComponent } from './materials/materials.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../../shared/shared.module';
import { TeacherLayoutComponent } from './teacher-layout/teacher-layout.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    MaterialsComponent,
    AssignmentsComponent,
    ProfileComponent,
    TeacherLayoutComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class TeacherModule { }
