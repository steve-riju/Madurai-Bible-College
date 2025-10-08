import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssignmentSubmissionDto } from '../models/assignment';

@Component({
  selector: 'app-view-submission-dialog',
  templateUrl: './view-submission-dialog.component.html',
  styleUrls: ['./view-submission-dialog.component.scss']
})
export class ViewSubmissionDialogComponent {
  submission: AssignmentSubmissionDto;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { submission: AssignmentSubmissionDto }) {
    this.submission = data.submission;
  }

  extractFileName(url: string): string {
    if (!url) return 'File';
    return url.split('/').pop() || url;
  }

  getFileType(url: string): 'pdf' | 'image' | 'other' {
    const ext = url.split('.').pop()?.toLowerCase();
    if (!ext) return 'other';
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
    return 'other';
  }
}
