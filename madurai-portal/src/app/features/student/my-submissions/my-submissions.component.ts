// features/student/my-submissions/my-submissions.component.ts
import { Component, OnInit } from '@angular/core';
import { StudentAssignmentsService } from '../services/student-assignments.service';
import { AssignmentSubmissionDto } from '../models/assignment';

@Component({
  selector: 'app-my-submissions',
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.scss']
})
export class MySubmissionsComponent implements OnInit {
  submissions: AssignmentSubmissionDto[] = [];
  loading = false;
  error: string | null = null;

  constructor(private service: StudentAssignmentsService) {}

  ngOnInit(): void {
    this.loadMySubmissions();
  }

  loadMySubmissions() {
    this.loading = true;
    this.service.getMySubmissions().subscribe({
      next: res => { this.submissions = res; this.loading = false; },
      error: err => { console.error(err); this.error = 'Failed loading submissions'; this.loading = false; }
    });
  }
}
