import { Component, OnInit } from '@angular/core';
import { LeaveRequest, LeaveStatus } from '../../../shared/models/leave.model';
import { ErrorUtilsService } from '../../../shared/services/error-utils.service';
import { AdminLeavesService } from '../services/admin-leaves.service';

@Component({
  selector: 'app-admin-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit {
  leaves: LeaveRequest[] = [];
  statusFilter: LeaveStatus | '' = '';
  searchTerm = '';
  remarks: Record<number, string> = {};
  loading = false;
  processingId?: number;

  constructor(
    private leavesService: AdminLeavesService,
    private errorUtils: ErrorUtilsService
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
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
    this.leavesService.getLeaves(this.statusFilter).subscribe({
      next: leaves => {
        this.leaves = leaves || [];
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorUtils.handleHttpError(err, { component: 'AdminLeaves', action: 'loadLeaves' });
      }
    });
  }

  approveLeave(leave: LeaveRequest): void {
    this.updateLeave(leave, 'APPROVED');
  }

  rejectLeave(leave: LeaveRequest): void {
    this.updateLeave(leave, 'REJECTED');
  }

  statusClass(status: LeaveStatus): string {
    return `status status--${status.toLowerCase()}`;
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
        this.errorUtils.showSuccess(`Leave request ${status.toLowerCase()}.`);
      },
      error: err => this.errorUtils.handleHttpError(err, { component: 'AdminLeaves', action: status }),
      complete: () => this.processingId = undefined
    });
  }
}
