import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AssignmentDto, AssignmentSubmissionDto }  from '../models/assignment';
import { StudentAssignmentsService } from '../services/student-assignments.service';

export interface ViewSubmissionDialogData {
  assignment: AssignmentDto;
}

@Component({
  selector: 'app-view-submission-dialog',
  templateUrl: './view-submission-dialog.component.html',
  styleUrls: ['./view-submission-dialog.component.scss']
})
export class ViewSubmissionDialogComponent implements OnInit {
  submission?: AssignmentSubmissionDto;
  loading = false;
  error?: string;

  constructor(
    private service: StudentAssignmentsService,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewSubmissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ViewSubmissionDialogData
  ) {}

  ngOnInit(): void {
    this.fetchSubmission();
  }

  fetchSubmission() {
    this.loading = true;
    this.service.getMySubmissionForAssignment(this.data.assignment.id).subscribe({
      next: (res) => {
        this.submission = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = "No submission found or failed to load.";
        this.loading = false;
      }
    });
  }

  getAttachmentPreview(url: string, contentType?: string): SafeResourceUrl | null {
    if (!url) return null;
    if (contentType?.startsWith('image/')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    if (contentType === 'application/pdf') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return null;
  }

  close() {
    this.dialogRef.close();
  }
}
