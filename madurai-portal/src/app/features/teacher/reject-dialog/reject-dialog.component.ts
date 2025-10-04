import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reject-dialog',
  template: `
    <h2 mat-dialog-title>Reject Submission</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Reason</mat-label>
        <textarea matInput [(ngModel)]="reason"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="warn" (click)="submit()">Reject</button>
    </mat-dialog-actions>
  `
})
export class RejectDialogComponent {
  reason = '';
  constructor(private ref: MatDialogRef<RejectDialogComponent>) {}
  close() { this.ref.close(); }
  submit() { this.ref.close(this.reason); }
}
