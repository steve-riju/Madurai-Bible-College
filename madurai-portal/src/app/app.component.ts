import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarOpen = false;

  constructor(public authService: AuthService) {}

  onToggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
