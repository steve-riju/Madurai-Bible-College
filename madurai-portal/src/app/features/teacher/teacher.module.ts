import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core'; 

// Feature Routing
import { TeacherRoutingModule } from './teacher-routing.module';

// Shared
import { SharedModule } from '../../shared/shared.module';

// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialsComponent } from './materials/materials.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ProfileComponent } from './profile/profile.component';
import { TeacherLayoutComponent } from './teacher-layout/teacher-layout.component';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SubmissionReviewComponent } from './submission-review/submission-review.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MaterialsComponent,
    AssignmentsComponent,
    ProfileComponent,
    TeacherLayoutComponent,
    SubmissionReviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,         // ✅ for <router-outlet>
    TeacherRoutingModule,
    SharedModule,         // ✅ should export NavbarComponent
    FormsModule,          // ✅ for [(ngModel)]
    ReactiveFormsModule,

    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MtxDatetimepickerModule,
    MtxNativeDatetimeModule,
    MatIcon,
    MatTableModule
  ]
})
export class TeacherModule {}
