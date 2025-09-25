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

  grade(sub: any) {
    const body = { marksObtained: 90, remarks: 'Good job' };
    this.service.gradeSubmission(sub.id, body).subscribe(updated => {
      sub.grade = updated.grade;
      sub.remarks = updated.remarks;
    });
  }

  reject(sub: any) {
    this.service.rejectSubmission(sub.id, 'Plagiarized').subscribe(updated => {
      sub.rejected = true;
      sub.remarks = updated.remarks;
    });
  }
}
