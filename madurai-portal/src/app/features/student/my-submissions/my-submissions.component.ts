// features/student/my-submissions/my-submissions.component.ts
import { Component, OnInit } from '@angular/core';
import { StudentAssignmentsService } from '../services/student-assignments.service';
import { AssignmentSubmissionDto } from '../models/assignment';
import { MatDialog } from '@angular/material/dialog';
import { ViewSubmissionDialogComponent } from '../view-submission-dialog/view-submission-dialog.component';

@Component({
  selector: 'app-my-submissions',
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.scss']
})
export class MySubmissionsComponent implements OnInit {
  submissions: AssignmentSubmissionDto[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private service: StudentAssignmentsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMySubmissions();
  }

  loadMySubmissions() {
    this.loading = true;
    this.service.getMySubmissions().subscribe({
      next: res => {
        this.submissions = res.sort((a, b) =>
          new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime()
        );
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Failed loading submissions';
        this.loading = false;
      }
    });
  }

  openSubmission(sub: AssignmentSubmissionDto) {
    this.dialog.open(ViewSubmissionDialogComponent, {
      width: '90%',
      maxWidth: '800px',
      data: { submission: sub }
    });
  }

   

  getStatusColor(status?: string): string {
    switch (status) {
      case 'SUBMITTED': return 'accent';
      case 'GRADED': return 'primary';
      case 'REJECTED': return 'warn';
      default: return '';
    }
  }

  extractFileName(url: string): string {
  if (!url) return 'File';
  return url.split('/').pop() || url;
}

}
