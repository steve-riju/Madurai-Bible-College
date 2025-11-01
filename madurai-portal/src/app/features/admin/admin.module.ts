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
import { EnrollmentsComponent, InlineConfirmDialog } from './enrollments/enrollments.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { OfferingsComponent } from './offerings/offerings.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminReportsComponent } from './reports/admin-reports/admin-reports.component';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';



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
    OfferingsComponent,
    InlineConfirmDialog,
    AdminReportsComponent
   ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatCardModule,       
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDividerModule,
    MatTooltipModule
  ]
})
export class AdminModule { }
