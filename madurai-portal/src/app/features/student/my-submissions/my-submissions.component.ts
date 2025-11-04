import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentAssignmentsService } from '../services/student-assignments.service';
import { AssignmentSubmissionDto } from '../models/assignment';
import { ViewSubmissionDialogComponent } from '../view-submission-dialog/view-submission-dialog.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-submissions',
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.scss']
})
export class MySubmissionsComponent implements OnInit {
  submissions: AssignmentSubmissionDto[] = [];
  loading = false;
  error: string | null = null;

  constructor(private service: StudentAssignmentsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.loading = true;
    this.service.getMySubmissions().subscribe({
      next: (res) => {
        this.submissions = res.map((s) => ({
          ...s,
          attachments: s.attachments?.map((a) => ({
            ...a,
            fileUrl: a.fileUrl?.startsWith('http')
              ? a.fileUrl
              : `${environment.apiUrl}/api/files/${a.fileUrl}`
          }))
        })) || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load submissions:', err);
        this.error = 'Failed to load submissions.';
        this.loading = false;
      }
    });
  }

  openSubmission(s: AssignmentSubmissionDto): void {
    this.dialog.open(ViewSubmissionDialogComponent, {
      width: '90%',
      maxWidth: '900px',
      data: { submission: s }
    });
  }

  extractFileName(url: string): string {
    try {
      const decoded = decodeURIComponent(url);
      const parts = decoded.split('_');
      const name = parts.length > 1 ? parts.slice(1).join('_') : decoded;
      return name.substring(0, 60); // truncate long names
    } catch {
      return url;
    }
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'SUBMITTED':
        return 'accent';
      case 'GRADED':
        return 'primary';
      case 'REJECTED':
        return 'warn';
      default:
        return '';
    }
  }

  getFileIcon(name: string = ''): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';

  switch (ext) {
    case 'pdf':
      return 'picture_as_pdf';
    case 'doc':
    case 'docx':
      return 'description';
    case 'ppt':
    case 'pptx':
      return 'slideshow';
    case 'xls':
    case 'xlsx':
      return 'grid_on';
    case 'zip':
    case 'rar':
    case '7z':
      return 'archive';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      return 'image';
    case 'txt':
      return 'article';
    case 'mp4':
    case 'mov':
    case 'avi':
      return 'movie';
    case 'mp3':
    case 'wav':
      return 'audiotrack';
    default:
      return 'insert_drive_file';
  }
}

}
