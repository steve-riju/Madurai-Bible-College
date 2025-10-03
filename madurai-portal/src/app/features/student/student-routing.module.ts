import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssignmentsComponent } from './assignments/assignments.component';
import { CoursesComponent } from './courses/courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './profile/profile.component';

import { StudentLayoutComponent } from './student-layout/student-layout.component';
import { AuthGuard } from '../../shared/auth.guard';
import { MySubmissionsComponent } from './my-submissions/my-submissions.component';

const routes: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'student' },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'assignments', component: AssignmentsComponent },
      { path: 'events', component: EventsComponent },
      { path: 'assignments', component: AssignmentsComponent },         // list
      { path: 'my-submissions', component: MySubmissionsComponent },     // tracking

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
