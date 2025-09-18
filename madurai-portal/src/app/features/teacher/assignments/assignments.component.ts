import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TeacherAssignmentsService } from '../services/teacher-assignments.service';

export interface BatchDto {
  id: number;
  name: string;
}

export interface AssignmentDto {
  id: number;
  title: string;
  description: string;

  createdAt: string;     // ISO datetime
  deadline: string;      // ISO datetime
  endDate?: string;      // ✅ for template binding
  status?: string;       // ✅ for template binding
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

  assignments: AssignmentDto[] = [];
  batches: BatchDto[] = [];

  constructor(private fb: FormBuilder, private assignmentsService: TeacherAssignmentsService) {
    this.assignmentForm = this.fb.group({
      title: [''],
      description: [''],
      batchId: [null],
      startDate: [''],
      endDate: [''],
      maxMarks: [],
      status: ['PUBLISHED']
    });
  }

 ngOnInit() {
  // load batches
  this.assignmentsService.getBatches().subscribe(batches => {
    this.batches = batches;
  });

  // load assignments (all or by batch)
  this.assignmentsService.getAllAssignments().subscribe(asgs => {
    this.assignments = asgs;
  });
}


  onFiles(event: any) {
    this.files = Array.from(event.target.files);
  }

  onCreate() {
    const fd = new FormData();
    const data = this.assignmentForm.value;
    fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    this.files.forEach(f => fd.append('files', f, f.name));
    this.assignmentsService.createAssignment(fd).subscribe(res => {
      this.assignments.push(res); // update UI after creation
    });
  }

  viewSubmissions(id: number) {
    console.log('View submissions for assignment:', id);
  }
}