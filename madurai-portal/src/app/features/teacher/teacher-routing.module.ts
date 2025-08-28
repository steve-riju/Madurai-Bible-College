import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeacherLayoutComponent } from './teacher-layout/teacher-layout.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialsComponent } from './materials/materials.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthGuard } from '../../shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TeacherLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'teacher' },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'materials', component: MaterialsComponent },
      { path: 'assignments', component: AssignmentsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}
