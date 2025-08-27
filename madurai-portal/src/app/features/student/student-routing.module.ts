import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignmentsComponent } from './assignments/assignments.component';
import { CoursesComponent } from './courses/courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthGuard } from '../../shared/auth.guard';


const routes: Routes = [
  { path: 'assignments', component: AssignmentsComponent, canActivate: [AuthGuard], data: { role: 'student' } },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard], data: { role: 'student' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { role: 'student' } },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard], data: { role: 'student' } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { role: 'student' } },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}

