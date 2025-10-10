import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reject-dialog',
  template: `
    <h2 mat-dialog-title>Reject submission</h2>
    <mat-dialog-content>
      <p>Reason for rejecting <strong>{{ data.student || '' }}</strong>:</p>
      <mat-form-field appearance="outline" class="full">
        <textarea matInput [formControl]="reason" rows="4" placeholder="Short explanation (visible to student)"></textarea>
        <mat-error *ngIf="reason.hasError('required')">Reason is required</mat-error>
        <mat-hint align="end">{{ reason.value?.length || 0 }}/255</mat-hint>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-flat-button color="warn" (click)="confirm()" [disabled]="reason.invalid">Reject</button>
    </mat-dialog-actions>
  `,
  styles: [`.full { width: 100%; }`]
})
export class RejectDialogComponent {
  reason = new FormControl('', [Validators.required, Validators.maxLength(255)]);
  constructor(
    public dialogRef: MatDialogRef<RejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancel() { this.dialogRef.close(null); }
  confirm() { this.dialogRef.close((this.reason.value ?? '').trim()); }
}
