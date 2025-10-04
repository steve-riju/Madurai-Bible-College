import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TeacherSubmissionReviewService } from '../services/teacher-submission-review.service';
import { RejectDialogComponent }  from '../reject-dialog/reject-dialog.component';

@Component({
  selector: 'app-submission-review',
  templateUrl: './submission-review.component.html',
  styleUrls: ['./submission-review.component.scss']
})
export class SubmissionReviewComponent implements OnInit {
  assignmentId!: number;
  submissions: any[] = [];
  loading = true;
  displayedColumns = ['student', 'answer', 'files', 'marks', 'remarks', 'status', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private service: TeacherSubmissionReviewService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.assignmentId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.loading = true;
    this.service.listSubmissions(this.assignmentId).subscribe({
      next: (res) => {
        this.submissions = res;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  saveGrade(sub: any) {
    if (sub.marksObtained < 0) {
      this.snack.open('Marks cannot be negative!', 'Close', { duration: 3000 });
      return;
    }
    this.service.gradeSubmission(sub.id, sub.marksObtained, sub.teacherRemarks).subscribe(updated => {
      Object.assign(sub, updated);
      this.snack.open('Grade saved ✅', 'Close', { duration: 2000 });
    });
  }

  openRejectDialog(sub: any) {
    const dialogRef = this.dialog.open(RejectDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        this.service.rejectSubmission(sub.id, reason).subscribe(updated => {
          Object.assign(sub, updated);
          this.snack.open('Submission rejected ❌', 'Close', { duration: 2000 });
        });
      }
    });
  }
}
