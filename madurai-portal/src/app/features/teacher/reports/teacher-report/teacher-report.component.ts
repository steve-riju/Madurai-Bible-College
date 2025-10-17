import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherReportsService } from '../../services/teacher-reports.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../shared/auth.service';


@Component({
  selector: 'app-teacher-report',
  templateUrl: './teacher-report.component.html',
  styleUrls: ['./teacher-report.component.scss']
})
export class TeacherReportComponent implements OnInit {

  reportForm!: FormGroup;
  submitting = false;
  teacherId: number | null =0; 
  teacherName: string | null ='Unknown Teacher';

  constructor(
    private fb: FormBuilder,
    private service: TeacherReportsService,
    private snack: MatSnackBar,
    private authService: AuthService
  ) {}




  ngOnInit(): void {
    this.teacherId = this.authService.getId(); // get the user id from auth service
    this.teacherName = this.authService.getName() ;
    this.reportForm = this.fb.group({
      teacherId: [this.teacherId, Validators.required],
      teacherName: [this.teacherName, Validators.required],
      date: [new Date().toISOString().slice(0, 10), Validators.required],
      batchName: ['', Validators.required],
      semester: ['', Validators.required],
      courseName: ['', Validators.required],
      lessonCovered: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      assignmentsGiven: [''],
      additionalNotes: ['']
    });
  }

  submitReport() {
    if (this.reportForm.invalid) {
      this.snack.open('⚠️ Please fill all required fields', 'Close', { duration: 2500 });
      return;
    }

    this.submitting = true;

    const payload = {
      ...this.reportForm.value,
      // The backend expects certain keys, adjust accordingly:
      batchId: null,
      courseAssignedId: null,
    };

    this.service.submitReport(payload).subscribe({
      next: res => {
        this.submitting = false;
        this.snack.open('✅ Report submitted successfully', 'Close', { duration: 2500 });
        this.reportForm.patchValue({
          lessonCovered: '',
          courseName: '',
          startTime: '',
          endTime: '',
          assignmentsGiven: '',
          additionalNotes: ''
        });
      },
      error: err => {
        this.submitting = false;
        console.error(err);
        this.snack.open('❌ Failed to submit report', 'Close', { duration: 3000 });
      }
    });
  }
}
