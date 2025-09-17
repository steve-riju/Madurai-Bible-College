import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AdminEnrollmentsService,
  StudentDto,
  CourseDto,
  SemesterDto,
  EnrollmentDto,
  CreateBatchWithEnrollmentsRequest
} from '../services/admin-enrollments.service';

interface EnrollmentTree {
  batchId: number;
  batchName: string;
  semesterName?: string;
  students: {
    studentId: number;
    studentName: string;
    courses: { courseId: number; courseName: string; enrollmentId: number }[];
  }[];
}

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss']
})
export class EnrollmentsComponent implements OnInit {
  students: StudentDto[] = [];
  filteredStudents: StudentDto[] = [];
  courses: CourseDto[] = [];
  filteredCourses: CourseDto[] = [];
  semesters: SemesterDto[] = [];
  enrollments: EnrollmentDto[] = [];
  enrollmentTree: EnrollmentTree[] = [];

  newBatchName = '';
  selectedSemesterId?: number;
  selectedStudentIds: number[] = [];
  selectedCourseIds: number[] = [];
  batchNames: string[] = [];
  filteredBatchNames: string[] = [];
  studentFilter = '';
  courseFilter = '';

  constructor(
    private enrollmentService: AdminEnrollmentsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
    this.loadEnrollments();
  }

  loadDropdowns(): void {
    this.enrollmentService.getStudents().subscribe(s => {
      this.students = s;
      this.filteredStudents = s;
    });
    this.enrollmentService.getCourses().subscribe(c => {
      this.courses = c;
      this.filteredCourses = c;
    });
    this.enrollmentService.getSemesters().subscribe(sem => (this.semesters = sem));
    this.enrollmentService.getBatches().subscribe(batches => {
      this.batchNames = batches.map(b => b.name);
      this.filteredBatchNames = this.batchNames;
    });
  }

  loadEnrollments(): void {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: data => {
        this.enrollments = data;
        this.buildTree();
      },
      error: (err: any) => console.error(err)
    });
  }

  buildTree(): void {
    const grouped: { [batchId: number]: EnrollmentTree } = {};
    for (const e of this.enrollments) {
      if (!grouped[e.batch.id]) {
        grouped[e.batch.id] = {
          batchId: e.batch.id,
          batchName: e.batch.name,
          semesterName: e.batch.semesterName ?? '',
          students: []
        };
      }
      const batch = grouped[e.batch.id];
      let student = batch.students.find(s => s.studentId === e.student.id);
      if (!student) {
        student = { studentId: e.student.id, studentName: e.student.name, courses: [] };
        batch.students.push(student);
      }
      if (!student.courses.find(c => c.courseId === e.course.id)) {
        student.courses.push({ courseId: e.course.id, courseName: e.course.name, enrollmentId: e.id });
      }
    }
    this.enrollmentTree = Object.values(grouped);
  }

  filterBatchNames(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredBatchNames = this.batchNames.filter(n =>
      n.toLowerCase().includes(filterValue)
    );
  }

  filterStudents(search: string) {
    this.filteredStudents = !search
      ? this.students
      : this.students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }

  filterCourses(search: string) {
    this.filteredCourses = !search
      ? this.courses
      : this.courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
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
      error: (err: any) =>
        this.snackBar.open('❌ Error: ' + (err?.error?.message || err.message), 'Close', { duration: 4000 })
    });
  }

  resetForm(): void {
    this.newBatchName = '';
    this.selectedSemesterId = undefined;
    this.selectedStudentIds = [];
    this.selectedCourseIds = [];
    this.filteredStudents = this.students;
    this.filteredCourses = this.courses;
  }

  removeEnrollment(id: number): void {
    const dialogRef = this.dialog.open(InlineConfirmDialog, {
      data: { title: 'Remove Enrollment', message: '⚠️ Do you really want to remove this enrollment?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enrollmentService.removeEnrollment(id).subscribe({
          next: () => {
            this.snackBar.open('🗑️ Enrollment removed', 'Close', { duration: 3000 });
            this.loadEnrollments();
          },
          error: (err: any) =>
            this.snackBar.open('❌ Error: ' + err.message, 'Close', { duration: 4000 })
        });
      }
    });
  }

  deleteBatch(batchId: number): void {
    const dialogRef = this.dialog.open(InlineConfirmDialog, {
      data: { title: 'Delete Batch', message: '⚠️ Delete this batch and all its enrollments?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enrollmentService.deleteBatch(batchId).subscribe({
          next: () => {
            this.snackBar.open('🗑️ Batch deleted', 'Close', { duration: 3000 });
            this.loadEnrollments();
            this.loadDropdowns();
          },
          error: (err: any) =>
            this.snackBar.open('❌ Error: ' + err.message, 'Close', { duration: 4000 })
        });
      }
    });
  }

  removeStudent(student: StudentDto): void {
    this.selectedStudentIds = this.selectedStudentIds.filter(id => id !== student.id);
  }

  removeCourse(course: CourseDto): void {
    this.selectedCourseIds = this.selectedCourseIds.filter(id => id !== course.id);
  }

  get selectedStudents(): StudentDto[] {
    return this.students.filter(s => this.selectedStudentIds.includes(s.id));
  }
  get selectedCourses(): CourseDto[] {
    return this.courses.filter(c => this.selectedCourseIds.includes(c.id));
  }
}

/* Inline confirmation dialog */
@Component({
  selector: 'inline-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Confirm' }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancel</button>
      <button mat-raised-button color="warn" (click)="dialogRef.close(true)">Delete</button>
    </mat-dialog-actions>
  `
})
export class InlineConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<InlineConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message: string }
  ) {}
}
