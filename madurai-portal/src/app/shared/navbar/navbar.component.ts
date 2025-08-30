import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  username: string | null = null;   // 🔹 use username instead of role

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();   // 🔹 fetch username
  }

  logout(): void {
    this.authService.logout();
  }
}
