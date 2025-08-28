import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-layout',
  templateUrl: './teacher-layout.component.html',
  styleUrls: ['./teacher-layout.component.scss']
})
export class TeacherLayoutComponent {
  sidebarOpen = false;

  onToggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
