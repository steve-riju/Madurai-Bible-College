import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignmentsComponent } from './assignments/assignments.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialsComponent } from './materials/materials.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthGuard } from '../../shared/auth.guard';

const routes: Routes = [
  { path: 'assignments', component: AssignmentsComponent, canActivate: [AuthGuard], data: { role: 'teacher' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { role: 'teacher' } },
  { path: 'materials', component: MaterialsComponent, canActivate: [AuthGuard], data: { role: 'teacher' } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { role: 'teacher' } },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}
