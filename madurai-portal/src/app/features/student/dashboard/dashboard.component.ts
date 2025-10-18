import { Component, OnInit } from '@angular/core';
import { StudentDashboardService } from '../services/student-dashboard.service';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: any = {};
  loading = true;
  studentName = ''; 
  greetingTime = '';
  dailyVerse = 'The Lord is my shepherd; I shall not be in want. – Psalm 23:1';
  displayedColumns = ['name', 'semester', 'teacher'];

  constructor(private dashboardService: StudentDashboardService,private authService: AuthService) {}

  ngOnInit(): void {
    this.studentName = this.authService.getName() || 'Student';
    this.setGreeting();
    this.dashboardService.getDashboardData().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard load failed', err);
        this.loading = false;
      }
    });
  }

  private setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greetingTime = 'Morning';
    else if (hour < 18) this.greetingTime = 'Afternoon';
    else this.greetingTime = 'Evening';
  }
}
