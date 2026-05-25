import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  loading = false;

  constructor(
    private leavesService: StudentLeavesService,
    private errorUtils: ErrorUtilsService
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshKey'] && !changes['refreshKey'].firstChange) {
      this.loadLeaves();
    }
  }

  loadLeaves(): void {
    this.loading = true;
    this.leavesService.getMyLeaves().subscribe({
      next: leaves => {
        this.leaves = leaves || [];
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorUtils.handleHttpError(err, { component: 'LeaveHistory', action: 'loadLeaves' });
      }
    });
  }

  statusClass(status: LeaveStatus): string {
    return `status status--${status.toLowerCase()}`;
  }
}
