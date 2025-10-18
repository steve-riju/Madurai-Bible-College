import { Component, OnInit } from '@angular/core';
import { TeacherDashboardService } from '../services/teacher-dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: any;
  loading = true;

  constructor(private dashboardService: TeacherDashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (res) => {
              console.table('Dashboard data loaded', res);
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard load failed', err);
        this.loading = false;
      }
    });
  }

  displayedColumns = ['name', 'semester', 'students', 'endDate'];


}


