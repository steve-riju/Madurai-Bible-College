import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TeacherSubmissionReviewService } from '../services/teacher-submission-review.service';
import { RejectDialogComponent } from '../reject-dialog/reject-dialog.component';
import { ViewAnswerDialogComponent } from '../view-answer-dialog/view-answer-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-submission-review',
  templateUrl: './submission-review.component.html',
  styleUrls: ['./submission-review.component.scss']
})
export class SubmissionReviewComponent implements OnInit {
  assignmentId!: number;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['student', 'answerPreview', 'files', 'marks', 'remarks', 'status', 'actions'];
  loading = false;
  savingMap: Record<number, boolean> = {};
  bulkDownloading = false;

  filterStatus: string = 'ALL';
  searchText: string = '';

  assignmentMeta: { maxMarks?: number, title?: string } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private service: TeacherSubmissionReviewService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.assignmentId = +this.route.snapshot.paramMap.get('id')!;
    this.loadAll();
  }

  private applyTableSetup() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Fix sorting for nested / computed fields
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'student':
          return item.studentName?.toLowerCase() || '';
        case 'marks':
          return item.marksObtained != null ? item.marksObtained : -1;
        default:
          return item[property];
      }
    };

    // Apply filter while preserving current sort
    const currentSort: Sort = this.sort?.active ? { ...this.sort, direction: this.sort.direction } : { active: '', direction: '' };
    this.applyFilter();

    // Restore sort state after filtering
    if (currentSort.active) {
      this.sort.active = currentSort.active;
      this.sort.direction = currentSort.direction;
      this.dataSource.data = this.dataSource.data.slice(); // trigger table refresh
    }
  }

  loadAll() {
    this.loading = true;

    // fetch assignment meta
    this.service.getAssignment(this.assignmentId).pipe(
      catchError(() => of(null))
    ).subscribe(meta => {
      if (meta) this.assignmentMeta = { maxMarks: meta.maxMarks, title: meta.title };
    });

    this.service.listSubmissions(this.assignmentId).pipe(
      catchError(() => {
        this.snack.open('Failed to load submissions', 'Close', { duration: 3000 });
        return of([]);
      }),
      finalize(() => this.loading = false)
    ).subscribe((res: any[]) => {
      const normalized = (res || []).map(s => ({
        id: s.id,
        studentName: s.studentName || s.student?.name || 'Unknown',
        textAnswer: s.textAnswer || '',
        attachmentUrls: s.attachmentUrls || (s.attachments || []).map((a: any) => a.url || a.fileUrl),
        marksObtained: s.marksObtained ?? null,
        teacherRemarks: s.teacherRemarks ?? '',
        status: s.status ?? 'SUBMITTED',
        maxMarks: this.assignmentMeta?.maxMarks ?? s.maxMarks ?? null
      }));
      this.dataSource.data = normalized;

      // setup paginator & sort after data
      setTimeout(() => this.applyTableSetup(), 0);
    });
  }

  applyFilter() {
    const status = this.filterStatus;
    const search = (this.searchText || '').toLowerCase().trim();

    this.dataSource.filterPredicate = (row: any, _filter: string) => {
      const sOk = (status === 'ALL') || (row.status === status);
      const text = `${row.studentName} ${row.textAnswer}`.toLowerCase();
      const searchOk = !search || text.includes(search);
      return sOk && searchOk;
    };

    // MatTableDataSource expects a string to trigger filter recalculation
    this.dataSource.filter = Math.random().toString();
  }

  preview(text: string, wordLimit = 1) {
    if (!text) return '—';
    const words = text.trim().split(/\s+/);
    let shortText = words.slice(0, wordLimit).join(' ');
    if (words.length > wordLimit) shortText += ' …';
    return shortText;
  }

  openFullAnswer(sub: any) {
    this.dialog.open(ViewAnswerDialogComponent, { width: '700px', data: { answer: sub.textAnswer, student: sub.studentName } });
  }

  canSave(sub: any) {
    if (sub.marksObtained == null) return false;
    if (isNaN(sub.marksObtained)) return false;
    if (sub.marksObtained < 0) return false;
    const max = sub.maxMarks ?? this.assignmentMeta.maxMarks ?? 100;
    if (sub.marksObtained > max) return false;
    return true;
  }

  saveGrade(sub: any) {
    if (!this.canSave(sub)) {
      this.snack.open('Please enter valid marks (0 - max).', 'Close', { duration: 3000 });
      return;
    }
    this.savingMap[sub.id] = true;
    this.service.gradeSubmission(sub.id, sub.marksObtained, sub.teacherRemarks).pipe(
      catchError(() => {
        this.snack.open('Failed to save grade', 'Close', { duration: 3000 });
        return of(null);
      }),
      finalize(() => this.savingMap[sub.id] = false)
    ).subscribe(updated => {
      if (updated) {
        Object.assign(sub, updated);
        this.snack.open('Grade saved ✅', 'Close', { duration: 2000 });
        this.applyFilter();
      }
    });
  }

  openRejectDialog(sub: any) {
    const ref = this.dialog.open(RejectDialogComponent, { width: '420px', data: { student: sub.studentName } });
    ref.afterClosed().subscribe(reason => {
      if (!reason) return;
      this.service.rejectSubmission(sub.id, reason).pipe(
        catchError(() => {
          this.snack.open('Failed to reject', 'Close', { duration: 3000 });
          return of(null);
        })
      ).subscribe(updated => {
        if (updated) {
          Object.assign(sub, updated);
          this.snack.open('Submission rejected ❌', 'Close', { duration: 2000 });
          this.applyFilter();
        }
      });
    });
  }

  downloadFile(url: string) {
    window.open(url, '_blank');
  }

  downloadAll() {
    if (this.bulkDownloading) return;
    this.bulkDownloading = true;
    this.service.bulkDownload(this.assignmentId).pipe(
      catchError(() => {
        this.snack.open('Bulk download failed', 'Close', { duration: 3000 });
        return of(null);
      }),
      finalize(() => this.bulkDownloading = false)
    ).subscribe(blob => {
      if (!blob) return;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions_${this.assignmentId}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  exportAsCSV() {
    const data = this.dataSource.filteredData.length
      ? this.dataSource.filteredData
      : this.dataSource.data;

    if (!data || data.length === 0) {
      this.snack.open('No submissions to export', 'Close', { duration: 3000 });
      return;
    }

    const csv = Papa.unparse(
      data.map(s => ({
        'Student Name': s.studentName || '',
        'Grade': s.marksObtained != null ? s.marksObtained : '',
        'Remarks': s.teacherRemarks || '',
        'Status': s.status || ''
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const fileName =
      (this.assignmentMeta.title?.replace(/[^\w\d-]/g, '_') || 'assignment') + '.csv';

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    this.snack.open('CSV exported successfully ✅', 'Close', { duration: 2000 });
  }

  uploadReviewFiles(sub: any) {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;

  input.onchange = () => {
    const files: FileList | null = input.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    this.savingMap[sub.id] = true;
    this.service.uploadReview(sub.id, formData).pipe(
      finalize(() => this.savingMap[sub.id] = false),
      catchError(() => {
        this.snack.open('Failed to upload review files', 'Close', { duration: 3000 });
        return of(null);
      })
    ).subscribe(updated => {
      if (updated) {
        Object.assign(sub, updated);
        this.snack.open('Review files uploaded ✅', 'Close', { duration: 2000 });
      }
    });
  };

  input.click();
}

}
