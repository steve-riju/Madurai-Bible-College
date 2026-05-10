import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionLandingComponent } from './landing/admission-landing.component';
import { AdmissionApplicationFormComponent } from './application-form/admission-application-form.component';

const routes: Routes = [
  { path: '', component: AdmissionLandingComponent },
  { path: ':slug', component: AdmissionApplicationFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicAdmissionsRoutingModule {}
