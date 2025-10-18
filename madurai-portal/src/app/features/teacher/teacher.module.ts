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
import { MatIconModule } from '@angular/material/icon'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
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
import { ViewAnswerDialogComponent } from './view-answer-dialog/view-answer-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { TeacherReportComponent } from './reports/teacher-report/teacher-report.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';





@NgModule({
  declarations: [
    DashboardComponent,
    MaterialsComponent,
    AssignmentsComponent,
    ProfileComponent,
    TeacherLayoutComponent,
    SubmissionReviewComponent,
    RejectDialogComponent,
    ViewAnswerDialogComponent,
    TeacherReportComponent
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
    MatIconModule,         
    MatDialogModule,       
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatToolbarModule, 
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    HttpClientModule,
    MatDividerModule
   

  ]
})
export class TeacherModule {}