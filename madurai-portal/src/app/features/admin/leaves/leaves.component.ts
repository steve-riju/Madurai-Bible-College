import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeaveRequest, LeaveStatus } from '../../../shared/models/leave.model';
import { ErrorUtilsService } from '../../../shared/services/error-utils.service';
import { AdminLeavesService } from '../services/admin-leaves.service';

interface CalendarDay {
  date: Date;
  currentMonth: boolean;
  leaves: LeaveRequest[];
}

@Component({
  selector: 'app-admin-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit {
  leaves: LeaveRequest[] = [];
  calendarLeaves: LeaveRequest[] = [];
  statusFilter: LeaveStatus | '' = '';
  searchTerm = '';
  remarks: Record<number, string> = {};
  loading = false;
  calendarLoading = false;
  processingId?: number;
  displayedColumns = ['student', 'dates', 'type', 'reason', 'status', 'remarks', 'actions'];
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;
  pageSizeOptions = [5, 10, 25];
  calendarDate = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private leavesService: AdminLeavesService,
    private errorUtils: ErrorUtilsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
    this.loadCalendarLeaves();
  }

  get filteredLeaves(): LeaveRequest[] {
    const search = this.searchTerm.trim().toLowerCase();
    if (!search) return this.leaves;

    return this.leaves.filter(leave => {
      const text = `${leave.studentName} ${leave.leaveType} ${leave.status} ${leave.reason}`.toLowerCase();
      return text.includes(search);
    });
  }

  loadLeaves(): void {
    this.loading = true;
    this.leavesService.getLeaves(this.statusFilter, this.pageIndex, this.pageSize).subscribe({
      next: page => {
        this.leaves = page.content || [];
        this.totalElements = page.totalElements || 0;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorUtils.handleHttpError(err, { component: 'AdminLeaves', action: 'loadLeaves' });
      }
    });
  }

  loadCalendarLeaves(): void {
    this.calendarLoading = true;
    this.leavesService.getLeaves('APPROVED', 0, 200, 'startDate,asc').subscribe({
      next: page => {
        this.calendarLeaves = page.content || [];
        this.buildCalendar();
        this.calendarLoading = false;
      },
      error: err => {
        this.calendarLoading = false;
        this.errorUtils.handleHttpError(err, { component: 'AdminLeaves', action: 'loadCalendarLeaves' });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLeaves();
  }

  onStatusFilterChange(): void {
    this.pageIndex = 0;
    this.loadLeaves();
  }

  approveLeave(leave: LeaveRequest): void {
    this.confirmAction(leave, 'APPROVED');
  }

  rejectLeave(leave: LeaveRequest): void {
    this.confirmAction(leave, 'REJECTED');
  }

  statusClass(status: LeaveStatus): string {
    return `status status--${status.toLowerCase()}`;
  }

  previousMonth(): void {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  openLeaveDetails(leave: LeaveRequest): void {
    this.dialog.open(LeaveDetailsDialogComponent, {
      width: '92%',
      maxWidth: '520px',
      data: leave
    });
  }

  private confirmAction(leave: LeaveRequest, status: Exclude<LeaveStatus, 'PENDING'>): void {
    const action = status === 'APPROVED' ? 'approve' : 'reject';
    const dialogRef = this.dialog.open(LeaveConfirmDialogComponent, {
      width: '92%',
      maxWidth: '420px',
      data: {
        title: `${status === 'APPROVED' ? 'Approve' : 'Reject'} Leave`,
        message: `Are you sure you want to ${action} this leave?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.updateLeave(leave, status);
      }
    });
  }

  private updateLeave(leave: LeaveRequest, status: Exclude<LeaveStatus, 'PENDING'>): void {
    this.processingId = leave.id;
    const payload = { remarks: this.remarks[leave.id] || undefined };
    const request = status === 'APPROVED'
      ? this.leavesService.approveLeave(leave.id, payload)
      : this.leavesService.rejectLeave(leave.id, payload);

    request.subscribe({
      next: updated => {
        Object.assign(leave, updated);
        this.remarks[leave.id] = '';
        this.snackBar.open(`Leave request ${status.toLowerCase()}.`, 'Close', { duration: 3000 });
        this.loadLeaves();
        this.loadCalendarLeaves();
      },
      error: err => this.errorUtils.handleHttpError(err, { component: 'AdminLeaves', action: status }),
      complete: () => this.processingId = undefined
    });
  }

  private buildCalendar(): void {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());
    const days: CalendarDay[] = [];

    for (let index = 0; index < 42; index++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      days.push({
        date,
        currentMonth: date.getMonth() === month,
        leaves: this.calendarLeaves.filter(leave => this.leaveIncludesDate(leave, date))
      });
    }

    this.calendarDays = days;
  }

  private leaveIncludesDate(leave: LeaveRequest, date: Date): boolean {
    const start = this.parseDate(leave.startDate);
    const end = this.parseDate(leave.endDate);
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);
    return current >= start && current <= end;
  }

  private parseDate(value: string): Date {
    const date = new Date(`${value}T00:00:00`);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}

@Component({
  selector: 'app-leave-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button type="button" (click)="dialogRef.close(false)">Cancel</button>
      <button mat-raised-button color="primary" type="button" (click)="dialogRef.close(true)">Confirm</button>
    </mat-dialog-actions>
  `
})
export class LeaveConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LeaveConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
}

@Component({
  selector: 'app-leave-details-dialog',
  template: `
    <h2 mat-dialog-title>Leave Details</h2>
    <mat-dialog-content class="leave-details-dialog">
      <p><strong>Student:</strong> {{ data.studentName }}</p>
      <p><strong>Dates:</strong> {{ data.startDate | date:'mediumDate' }} to {{ data.endDate | date:'mediumDate' }}</p>
      <p><strong>Type:</strong> {{ data.leaveType }}</p>
      <p><strong>Status:</strong> {{ data.status }}</p>
      <p><strong>Reason:</strong> {{ data.reason }}</p>
      <p><strong>Remarks:</strong> {{ data.adminRemarks || '-' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" type="button" (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `
})
export class LeaveDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LeaveDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeaveRequest
  ) {}
}
