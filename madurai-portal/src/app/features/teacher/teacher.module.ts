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
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon'; // ✅ CORRECTED: Import the module, not the component
import { MatDialogModule } from '@angular/material/dialog'; // ✅ CORRECTED: Import the main dialog module
import { MatProgressBarModule } from '@angular/material/progress-bar'; // ✅ ADD THIS: For mat-progress-bar
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
import { SubmissionReviewComponent } from './submission-review/submission-review.component';
import { RejectDialogComponent } from './reject-dialog/reject-dialog.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MaterialsComponent,
    AssignmentsComponent,
    ProfileComponent,
    TeacherLayoutComponent,
    SubmissionReviewComponent,
    RejectDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TeacherRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MtxDatetimepickerModule,
    MtxNativeDatetimeModule,
    MatTableModule,
    MatIconModule,         // ✅ CORRECTED
    MatDialogModule,       // ✅ CORRECTED
    MatProgressBarModule   // ✅ ADD THIS
  ]
})
export class TeacherModule {}