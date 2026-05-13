import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { PublicAdmissionsRoutingModule } from './public-admissions-routing.module';
import { AdmissionLandingComponent } from './landing/admission-landing.component';
import { AdmissionApplicationFormComponent } from './application-form/admission-application-form.component';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [
    AdmissionLandingComponent,
    AdmissionApplicationFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PublicAdmissionsRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SharedModule
  ]
})
export class PublicAdmissionsModule {}
