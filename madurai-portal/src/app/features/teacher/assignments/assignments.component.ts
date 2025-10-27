import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TeacherAssignmentsService } from '../services/teacher-assignments.service';
import { Router } from '@angular/router';

export interface BatchDto {
  id: number;
  name: string;
}

export interface AssignmentDto {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  deadline: string;
  endDate?: string;
  status?: string;
  published: boolean;
  batchId: number;
  batchName: string;
  teacherId: number;
  teacherName: string;
  attachmentUrls: string[];
}

export interface SubmissionDto {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName: string;

  textAnswer: string;
  attachmentUrls: string[];

  submittedAt: string;   // ISO datetime

  grade?: number;
  feedback?: string;
  rejected: boolean;
  rejectionReason?: string;
}



@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit {
  assignmentForm: FormGroup;
  files: File[] = [];
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
  fileError: string | null = null;

  assignments: AssignmentDto[] = [];
  batches: BatchDto[] = [];

  constructor(private fb: FormBuilder, private assignmentsService: TeacherAssignmentsService, private router: Router) {
    this.assignmentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, this.wordCountValidator(500)]],
      batchId: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      maxMarks: [null, [Validators.required, Validators.min(1)]],
      status: ['PUBLISHED', Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit() {
    this.assignmentsService.getBatches().subscribe(batches => {
      this.batches = batches;
    });

    this.assignmentsService.getAllAssignments().subscribe(asgs => {
      this.assignments = asgs;
    });
  }

  // ✅ Custom validator: max word count
  wordCountValidator(maxWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const wordCount = control.value.trim().split(/\s+/).length;
      return wordCount > maxWords ? { wordCount: true } : null;
    };
  }

  // ✅ Custom validator: start < end date
  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && new Date(start) >= new Date(end)) {
      return { dateRange: true };
    }
    return null;
  }

  onFiles(event: any) {
    const inputFiles = Array.from(event.target.files as File[]);
    const invalidFiles = inputFiles.filter(f => f.size > this.MAX_FILE_SIZE);
    
    if (invalidFiles.length > 0) {
      this.fileError = `One or more files exceed the 50MB size limit: ${invalidFiles.map(f => f.name).join(', ')}`;
      this.files = [];
      return;
    }
    
    this.fileError = null;
    this.files = inputFiles;
  }

  onCreate() {
    if (this.assignmentForm.invalid) return;

    const fd = new FormData();
    const data = this.assignmentForm.value;
    fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    this.files.forEach(f => fd.append('files', f, f.name));

    this.assignmentsService.createAssignment(fd).subscribe(res => {
      this.assignments.push(res);
      this.assignmentForm.reset({ status: 'PUBLISHED' });
      this.files = [];
    });
  }

selectedAssignmentId?: number;
confirmDeleteId?: number; // track which assignment is being confirmed

 viewSubmissions(id: number) {
  this.router.navigate(['/teacher/assignments', id, 'submissions']);
  }

askDelete(assignmentId: number) {
  this.confirmDeleteId = assignmentId;
}

cancelDelete() {
  this.confirmDeleteId = undefined;
}

confirmDelete(assignmentId: number) {
  this.assignmentsService.deleteAssignment(assignmentId).subscribe(() => {
    this.assignments = this.assignments.filter(a => a.id !== assignmentId);
    this.confirmDeleteId = undefined;
  });
}


  
}