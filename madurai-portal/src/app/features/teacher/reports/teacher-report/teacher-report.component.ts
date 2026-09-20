import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherReportsService } from '../../services/teacher-reports.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../shared/auth.service';
import { TeacherReportAllocation } from '../../models/teacher-report';


@Component({
  selector: 'app-teacher-report',
  templateUrl: './teacher-report.component.html',
  styleUrls: ['./teacher-report.component.scss']
})
export class TeacherReportComponent implements OnInit {

  reportForm!: FormGroup;
  submitting = false;
  loadingAllocations = false;
  allocations: TeacherReportAllocation[] = [];
  batchSearch = '';
  semesterSearch = '';
  courseSearch = '';
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
      batchId: [null, Validators.required],
      batchName: ['', Validators.required],
      semester: ['', Validators.required],
      courseAssignedId: [null, Validators.required],
      courseName: ['', Validators.required],
      lessonCovered: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      assignmentsGiven: [''],
      additionalNotes: ['']
    });
    this.loadAllocations();
  }

  get batchOptions(): TeacherReportAllocation[] {
    const seen = new Set<number>();
    const search = this.batchSearch.trim().toLowerCase();
    return this.allocations
      .filter(allocation => !search || allocation.batchName.toLowerCase().includes(search))
      .filter(allocation => {
        if (seen.has(allocation.batchId)) return false;
        seen.add(allocation.batchId);
        return true;
      });
  }

  get semesterOptions(): string[] {
    const batchId = this.reportForm?.get('batchId')?.value;
    const search = this.semesterSearch.trim().toLowerCase();
    return Array.from(new Set(
      this.allocations
        .filter(allocation => !batchId || allocation.batchId === Number(batchId))
        .map(allocation => allocation.semesterName)
        .filter(semester => !search || semester.toLowerCase().includes(search))
    )).sort((a, b) => a.localeCompare(b));
  }

  get courseOptions(): TeacherReportAllocation[] {
    const batchId = this.reportForm?.get('batchId')?.value;
    const semester = this.reportForm?.get('semester')?.value;
    const search = this.courseSearch.trim().toLowerCase();
    return this.allocations.filter(allocation =>
      (!batchId || allocation.batchId === Number(batchId)) &&
      (!semester || allocation.semesterName === semester) &&
      (!search || allocation.courseName.toLowerCase().includes(search))
    );
  }

  loadAllocations(): void {
    this.loadingAllocations = true;
    this.service.getReportAllocations().subscribe({
      next: allocations => {
        this.allocations = allocations || [];
        this.loadingAllocations = false;
      },
      error: err => {
        console.error(err);
        this.loadingAllocations = false;
        this.snack.open('Failed to load assigned batch and course options', 'Close', { duration: 3000 });
      }
    });
  }

  onBatchChange(batchId: number): void {
    const allocation = this.allocations.find(item => item.batchId === Number(batchId));
    this.reportForm.patchValue({
      batchName: allocation?.batchName || '',
      semester: '',
      courseAssignedId: null,
      courseName: ''
    });
    this.semesterSearch = '';
    this.courseSearch = '';
  }

  onSemesterChange(): void {
    this.reportForm.patchValue({
      courseAssignedId: null,
      courseName: ''
    });
    this.courseSearch = '';
  }

  onCourseChange(courseAssignedId: number): void {
    const batchId = this.reportForm.get('batchId')?.value;
    const semester = this.reportForm.get('semester')?.value;
    const allocation = this.allocations.find(item =>
      item.courseAssignedId === Number(courseAssignedId) &&
      item.batchId === Number(batchId) &&
      item.semesterName === semester
    );
    if (!allocation) return;

    this.reportForm.patchValue({
      batchId: allocation.batchId,
      batchName: allocation.batchName,
      semester: allocation.semesterName,
      courseName: allocation.courseName
    });
  }

  submitReport() {
    if (this.reportForm.invalid) {
      this.snack.open('⚠️ Please fill all required fields', 'Close', { duration: 2500 });
      return;
    }

    this.submitting = true;

    const payload = this.reportForm.value;

    this.service.submitReport(payload).subscribe({
      next: res => {
        this.submitting = false;
        this.snack.open('✅ Report submitted successfully', 'Close', { duration: 2500 });
        this.reportForm.patchValue({
          lessonCovered: '',
          courseAssignedId: null,
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
