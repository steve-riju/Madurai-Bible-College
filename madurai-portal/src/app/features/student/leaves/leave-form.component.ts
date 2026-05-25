import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorUtilsService } from '../../../shared/services/error-utils.service';
import { LeaveRequestPayload } from '../../../shared/models/leave.model';
import { StudentLeavesService } from '../services/student-leaves.service';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent {
  @Output() leaveApplied = new EventEmitter<void>();

  formGroup: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private leavesService: StudentLeavesService,
    private errorUtils: ErrorUtilsService,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.fb.group({
      leaveType: ['NORMAL', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  get normalLeaveWarning(): boolean {
    const leaveType = this.formGroup.get('leaveType')?.value;
    const startDate = this.formGroup.get('startDate')?.value;
    if (leaveType !== 'NORMAL' || !startDate) return false;

    const start = this.parseDate(startDate);
    const minStart = new Date();
    minStart.setHours(0, 0, 0, 0);
    minStart.setDate(minStart.getDate() + 7);
    return start < minStart;
  }

  get invalidDateRange(): boolean {
    const startDate = this.formGroup.get('startDate')?.value;
    const endDate = this.formGroup.get('endDate')?.value;
    if (!startDate || !endDate) return false;
    return this.parseDate(endDate) < this.parseDate(startDate);
  }

  submit(): void {
    if (this.formGroup.invalid || this.invalidDateRange || this.normalLeaveWarning) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.formGroup.value as LeaveRequestPayload;

    this.leavesService.applyLeave(payload).subscribe({
      next: () => {
        this.snackBar.open('Leave request submitted.', 'Close', { duration: 3000 });
        this.formGroup.reset({ leaveType: 'NORMAL' });
        this.leaveApplied.emit();
      },
      error: err => this.errorUtils.handleHttpError(err, { component: 'LeaveForm', action: 'applyLeave' }),
      complete: () => this.saving = false
    });
  }

  private parseDate(value: string): Date {
    const date = new Date(`${value}T00:00:00`);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
