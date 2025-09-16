import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { CoursesComponent } from './courses/courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { FaqsComponent } from './faqs/faqs.component';
import { UsersComponent } from './users/users.component';

import { AuthGuard } from '../../shared/auth.guard';
import { EnrollmentsComponent } from './enrollments/enrollments.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { OfferingsComponent } from './offerings/offerings.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'events', component: EventsComponent },
      { path: 'faqs', component: FaqsComponent },
      { path: 'enrollments', component: EnrollmentsComponent },
      { path: 'admissions', component: AdmissionsComponent },
      { path: 'offerings', component: OfferingsComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
