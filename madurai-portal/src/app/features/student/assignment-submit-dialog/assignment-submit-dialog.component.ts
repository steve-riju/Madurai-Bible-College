// features/student/assignment-submit-dialog/assignment-submit-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignmentDto, AssignmentSubmissionDto } from '../models/assignment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentAssignmentsService } from '../services/student-assignments.service';

@Component({
  selector: 'app-assignment-submit-dialog',
  templateUrl: './assignment-submit-dialog.component.html',
  styleUrls: ['./assignment-submit-dialog.component.scss']
})
export class AssignmentSubmitDialogComponent {
  assignment: AssignmentDto;
  submissionForm: FormGroup;
  selectedFiles: File[] = [];
  uploading = false;
  error: string | null = null;
  previewFiles: {name:string,size:number}[] = [];
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { assignment: AssignmentDto },
    private fb: FormBuilder,
    private service: StudentAssignmentsService,
    private dialogRef: MatDialogRef<AssignmentSubmitDialogComponent>
  ) {
    this.assignment = data.assignment;
    this.submissionForm = this.fb.group({
      textAnswer: ['']
    });
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files) return;
    
    const files = Array.from(input.files);
    const invalidFiles = files.filter(f => f.size > this.MAX_FILE_SIZE);
    
    if (invalidFiles.length > 0) {
      this.error = `One or more files exceed the 50MB limit: ${invalidFiles.map(f => f.name).join(', ')}`;
      

      this.selectedFiles = []; 
      this.previewFiles = [];
      //  Reset the input field so the user can re-select files
      input.value = ''; 
      
      return;
    }
    
    // This code only runs if all files are valid
    this.selectedFiles = files;
    this.previewFiles = this.selectedFiles.map(f => ({ name: f.name, size: f.size }));
    this.error = null; 
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewFiles.splice(index, 1);

    if (this.selectedFiles.length === 0) {
      this.error = null;
    }
  }

  submitAssignment() {
    this.error = null;
    this.uploading = true;
    const text = this.submissionForm.value.textAnswer;
    this.service.submitAssignment(this.assignment.id, text, this.selectedFiles)
      .subscribe({
        next: (res: AssignmentSubmissionDto) => {
          this.uploading = false;
          this.dialogRef.close('submitted');
        },
        error: (err) => {
          console.error(err);
          this.uploading = false;
          this.error = err?.error?.message || 'Submission failed';
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
