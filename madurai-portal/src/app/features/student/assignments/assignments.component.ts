// features/student/assignments/assignments.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentAssignmentsService } from '../services/student-assignments.service';
import { AssignmentDto } from '../models/assignment';
import { AssignmentSubmitDialogComponent } from '../assignment-submit-dialog/assignment-submit-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { BatchDto } from '../../teacher/assignments/assignments.component';
import { ViewSubmissionDialogComponent } from '../view-submission-dialog/view-submission-dialog.component';
@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})


export class AssignmentsComponent implements OnInit {
  assignments: AssignmentDto[] = [];
  batches: BatchDto[] = [];   // 👈 store all student batches
  loading = false;
  error: string | null = null;
  batchId?: number;

  constructor(
    private service: StudentAssignmentsService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const batchFromQuery = Number(this.route.snapshot.queryParamMap.get('batch'));

    if (batchFromQuery) {
      this.batchId = batchFromQuery;
      this.loadAssignments(batchFromQuery);
    } else {
      // load student’s batches
      this.service.getMyBatches().subscribe({
        next: (batches) => {
          this.batches = batches;
          if (batches.length) {
            this.batchId = batches[0].id;
            this.loadAssignments(this.batchId);
          } else {
            this.error = "You are not enrolled in any batches.";
          }
        },
        error: (err) => {
          console.error(err);
          this.error = "Failed to load your batches.";
        }
      });
    }
  }

  onBatchChange(batchId: number) {
    this.batchId = batchId;
    this.loadAssignments(batchId);
  }

  loadAssignments(batchId: number) {
    this.loading = true;
    this.service.getAssignmentsForBatch(batchId).subscribe({
      next: (res) => {
        this.assignments = res;
        this.loading = false;
      },
      error: (err) => {
        console.error("❌ Error loading assignments:", err);
        this.error = 'Failed loading assignments';
        this.loading = false;
      }
    });
  }


  getDeadlineStatus(deadline?: string): string {
  if (!deadline) return 'upcoming';
  const now = new Date();
  const d = new Date(deadline);
  if (d.getTime() < now.getTime()) return 'overdue';
  const diff = d.getTime() - now.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  if (diff <= 3 * dayMs) return 'due-soon';
  return 'active';
}


  openAssignment(a: AssignmentDto) {
  if (a.submitted && a.submission) {
    this.dialog.open(ViewSubmissionDialogComponent, {
      width: '92%',
      maxWidth: '900px',
      data: { assignment: a }
    });
  } else {
    const ref = this.dialog.open(AssignmentSubmitDialogComponent, {
      width: '92%',
      maxWidth: '900px',
      data: { assignment: a }
    });

    ref.afterClosed().subscribe(result => {
      if (result === 'submitted' && this.batchId) {
        this.loadAssignments(this.batchId);
      }
    });
  }
}


  openViewSubmission(a: AssignmentDto) {
  this.dialog.open(ViewSubmissionDialogComponent, {
    width: '90%',
    maxWidth: '800px',
    data: { assignment: a }
  });
}

}
