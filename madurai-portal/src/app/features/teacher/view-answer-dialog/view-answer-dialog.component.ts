import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-answer-dialog',
  template: `
    <h2 mat-dialog-title>Answer: {{ data.student }}</h2>
    <mat-dialog-content>
      <div class="answer-box" [innerText]="data.answer || '—'"></div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .answer-box { white-space: pre-wrap; word-break: break-word; max-height: 60vh; overflow: auto; padding: 8px; }
  `]
})
export class ViewAnswerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
