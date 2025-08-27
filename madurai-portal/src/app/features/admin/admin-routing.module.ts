import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoursesComponent } from './courses/courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { FaqsComponent } from './faqs/faqs.component';
import { UsersComponent } from './users/users.component';

import { AuthGuard } from '../../shared/auth.guard';

const routes: Routes = [
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'faqs', component: FaqsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
