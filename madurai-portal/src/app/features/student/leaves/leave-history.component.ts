import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { LeaveRequest, LeaveStatus } from '../../../shared/models/leave.model';
import { ErrorUtilsService } from '../../../shared/services/error-utils.service';
import { StudentLeavesService } from '../services/student-leaves.service';

@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.scss']
})
export class LeaveHistoryComponent implements OnInit, OnChanges {
  @Input() refreshKey = 0;

  leaves: LeaveRequest[] = [];
  displayedColumns = ['dates', 'type', 'status', 'appliedDate', 'adminRemarks'];
  loading = false;
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;
  pageSizeOptions = [5, 10, 25];

  constructor(
    private leavesService: StudentLeavesService,
    private errorUtils: ErrorUtilsService
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshKey'] && !changes['refreshKey'].firstChange) {
      this.pageIndex = 0;
      this.loadLeaves();
    }
  }

  loadLeaves(): void {
    this.loading = true;
    this.leavesService.getMyLeaves(this.pageIndex, this.pageSize).subscribe({
      next: page => {
        this.leaves = page.content || [];
        this.totalElements = page.totalElements || 0;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorUtils.handleHttpError(err, { component: 'LeaveHistory', action: 'loadLeaves' });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLeaves();
  }

  statusClass(status: LeaveStatus): string {
    return `status status--${status.toLowerCase()}`;
  }
}
