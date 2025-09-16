import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AdminEnrollmentsService,
  StudentDto,
  CourseDto,
  SemesterDto,
  EnrollmentDto,
  CreateBatchWithEnrollmentsRequest
} from '../services/admin-enrollments.service';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss']
})
export class EnrollmentsComponent implements OnInit {
  students: StudentDto[] = [];
  courses: CourseDto[] = [];
  semesters: SemesterDto[] = [];
  enrollments: EnrollmentDto[] = [];

  newBatchName = '';
  selectedSemesterId?: number;
  selectedStudentIds: number[] = [];
  selectedCourseIds: number[] = [];

  batchNames: string[] = [];
  filteredBatchNames: string[] = [];

  constructor(
    private enrollmentService: AdminEnrollmentsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
    this.loadEnrollments();
  }

  loadDropdowns(): void {
    this.enrollmentService.getStudents().subscribe(s => (this.students = s));
    this.enrollmentService.getCourses().subscribe(c => (this.courses = c));
    this.enrollmentService.getSemesters().subscribe(sem => (this.semesters = sem));
    this.enrollmentService.getBatches().subscribe(batches => {
      this.batchNames = batches.map(b => b.name);
    });
  }

  loadEnrollments(): void {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: data => (this.enrollments = data),
      error: err => console.error(err)
    });
  }

  filterBatchNames(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredBatchNames = this.batchNames.filter(n =>
      n.toLowerCase().includes(filterValue)
    );
  }

  processEnrollment(): void {
    if (!this.newBatchName) {
      this.snackBar.open('⚠️ Enter batch name', 'Close', { duration: 3000 });
      return;
    }
    if (!this.selectedSemesterId) {
      this.snackBar.open('⚠️ Select a semester', 'Close', { duration: 3000 });
      return;
    }
    if (this.selectedStudentIds.length === 0) {
      this.snackBar.open('⚠️ Select at least one student', 'Close', { duration: 3000 });
      return;
    }
    if (this.selectedCourseIds.length === 0) {
      this.snackBar.open('⚠️ Select at least one course', 'Close', { duration: 3000 });
      return;
    }

    const request: CreateBatchWithEnrollmentsRequest = {
      name: this.newBatchName,
      semesterId: this.selectedSemesterId.toString(),
      studentIds: this.selectedStudentIds,
      courseAssignedIds: this.selectedCourseIds
    };

    this.enrollmentService.createBatchWithEnrollments(request).subscribe({
      next: () => {
        this.snackBar.open('✅ Batch & enrollments processed successfully', 'Close', { duration: 3000 });
        this.resetForm();
        this.loadEnrollments();
      },
      error: err =>
        this.snackBar.open('❌ Error: ' + (err?.error?.message || err.message), 'Close', { duration: 4000 })
    });
  }

  resetForm(): void {
    this.newBatchName = '';
    this.selectedSemesterId = undefined;
    this.selectedStudentIds = [];
    this.selectedCourseIds = [];
  }

  removeEnrollment(id: number): void {
    this.enrollmentService.removeEnrollment(id).subscribe({
      next: () => {
        this.snackBar.open('🗑️ Enrollment removed', 'Close', { duration: 3000 });
        this.loadEnrollments();
      },
      error: err =>
        this.snackBar.open('❌ Error: ' + err.message, 'Close', { duration: 4000 })
    });
  }

  // ✅ remove chips inline
  removeStudent(student: StudentDto): void {
    this.selectedStudentIds = this.selectedStudentIds.filter(id => id !== student.id);
  }

  removeCourse(course: CourseDto): void {
    this.selectedCourseIds = this.selectedCourseIds.filter(id => id !== course.id);
  }

  // getters for selected chips
  get selectedStudents(): StudentDto[] {
    return this.students.filter(s => this.selectedStudentIds.includes(s.id));
  }

  get selectedCourses(): CourseDto[] {
    return this.courses.filter(c => this.selectedCourseIds.includes(c.id));
  }
}
