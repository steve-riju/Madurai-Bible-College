import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherSubmissionReviewService } from '../services/teacher-submission-review.service';

@Component({
  selector: 'app-submission-review',
  templateUrl: './submission-review.component.html',
  styleUrls: ['./submission-review.component.scss']
})
export class SubmissionReviewComponent implements OnInit {
  assignmentId!: number;
  submissions: any[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private service: TeacherSubmissionReviewService) {}

  ngOnInit(): void {
    this.assignmentId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.service.listSubmissions(this.assignmentId).subscribe({
      next: (res) => {
        this.submissions = res;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

 saveGrade(sub: any) {
  this.service.gradeSubmission(sub.id, sub.marksObtained, sub.teacherRemarks).subscribe(updated => {
    Object.assign(sub, updated); // refresh row
  });
}

reject(sub: any) {
  const reason = prompt("Enter reason for rejection:", "Incomplete work");
  if (!reason) return;
  this.service.rejectSubmission(sub.id, reason).subscribe(updated => {
    Object.assign(sub, updated);
  });
}

}
