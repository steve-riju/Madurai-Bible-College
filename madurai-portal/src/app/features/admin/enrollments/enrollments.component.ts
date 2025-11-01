import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';

interface EnrollmentTree {
  batchId: number;
  batchName: string;
  semesterName?: string;
  expanded?: boolean;
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
export class EnrollmentsComponent implements OnInit, OnDestroy {
  students: StudentDto[] = [];
  filteredStudents: StudentDto[] = [];
  courses: CourseDto[] = [];
  filteredCourses: CourseDto[] = [];
  semesters: SemesterDto[] = [];
  enrollments: EnrollmentDto[] = [];
  enrollmentTree: EnrollmentTree[] = [];
  filteredEnrollmentTree: EnrollmentTree[] = [];

  newBatchName = '';
  selectedSemesterId?: number;
  selectedStudentIds: number[] = [];
  selectedCourseIds: number[] = [];
  batchNames: string[] = [];
  filteredBatchNames: string[] = [];
  studentFilter = '';
  courseFilter = '';
  batchSearchFilter = '';

  isLoading = false;
  isProcessing = false;

  private destroy$ = new Subject<void>();
  private batchSearch$ = new Subject<string>();
  private batchNameSearch$ = new Subject<string>();

  constructor(
    private enrollmentService: AdminEnrollmentsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupSearchSubscriptions();
    this.loadDropdowns();
    this.loadEnrollments();
    // ensure filteredEnrollmentTree initialized
    this.filteredEnrollmentTree = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchSubscriptions(): void {
    // debounce batch search (search input in header)
    this.batchSearch$
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => {
        this.batchSearchFilter = value ?? '';
        this.filterBatches();
      });

    // debounce new batch-name autocomplete search
    this.batchNameSearch$
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => this.filterBatchNames(value));
  }

  loadDropdowns(): void {
    this.enrollmentService.getStudents().pipe(takeUntil(this.destroy$)).subscribe(s => {
      this.students = s || [];
      this.filteredStudents = [...this.students];
    });

    this.enrollmentService.getCourses().pipe(takeUntil(this.destroy$)).subscribe(c => {
      this.courses = c || [];
      this.filteredCourses = [...this.courses];
    });

    this.enrollmentService.getSemesters().pipe(takeUntil(this.destroy$)).subscribe(sem => {
      this.semesters = sem || [];
    });

    this.enrollmentService.getBatches().pipe(takeUntil(this.destroy$)).subscribe(batches => {
      this.batchNames = (batches || []).map(b => b.name);
      this.filteredBatchNames = [...this.batchNames];
    });
  }

  loadEnrollments(): void {
    this.isLoading = true;
    // take(1) to avoid multiple emissions causing repeated rebuilds
    this.enrollmentService.getAllEnrollments().pipe(take(1)).subscribe({
      next: data => {
        this.enrollments = data || [];
        this.buildTree();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
        this.snackBar.open('❌ Error loading enrollments: ' + (err?.error?.message || err?.message || err), 'Close', { duration: 4000 });
      }
    });
  }

  buildTree(): void {
    const grouped: { [batchId: number]: EnrollmentTree } = {};
    for (const e of this.enrollments) {
      const batchId = e.batch?.id;
      if (batchId == null) { continue; }
      if (!grouped[batchId]) {
        grouped[batchId] = {
          batchId,
          batchName: e.batch?.name ?? 'Unnamed batch',
          semesterName: e.batch?.semesterName ?? '',
          expanded: false,
          students: []
        };
      }
      const batch = grouped[batchId];
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
    // Apply whatever filter is active
    this.filterBatches();
  }

  // Called from template via (ngModelChange)
  onBatchSearchChange(value: string): void {
    this.batchSearch$.next(value ?? '');
  }

  // Called from template via (ngModelChange) for new batch name autocomplete
  onBatchNameChange(value: string): void {
    this.batchNameSearch$.next(value ?? '');
  }

  filterBatchNames(value: string | null | undefined): void {
    const v = (value ?? '').toString().trim();
    if (!v) {
      this.filteredBatchNames = [...this.batchNames];
      return;
    }
    const filterValue = v.toLowerCase();
    this.filteredBatchNames = this.batchNames.filter(n => n.toLowerCase().includes(filterValue));
  }

  filterStudents(search: string) {
    this.filteredStudents = !search
      ? [...this.students]
      : this.students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }

  filterCourses(search: string) {
    this.filteredCourses = !search
      ? [...this.courses]
      : this.courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }

  processEnrollment(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isProcessing = true;
    const request: CreateBatchWithEnrollmentsRequest = {
      name: this.newBatchName,
      semesterId: this.selectedSemesterId!.toString(),
      studentIds: this.selectedStudentIds,
      courseAssignedIds: this.selectedCourseIds
    };

    this.enrollmentService.createBatchWithEnrollments(request).pipe(take(1)).subscribe({
      next: () => {
        this.snackBar.open('✅ Batch & enrollments created successfully', 'Close', { duration: 3000 });
        this.resetForm();
        // reload data
        this.loadEnrollments();
        this.loadDropdowns();
        this.isProcessing = false;
      },
      error: (err: any) => {
        this.isProcessing = false;
        this.snackBar.open('❌ Error: ' + (err?.error?.message || err?.message || err), 'Close', { duration: 4000 });
      }
    });
  }

  isFormValid(): boolean {
    if (!this.newBatchName?.trim()) {
      this.snackBar.open('⚠️ Please enter a batch name', 'Close', { duration: 3000 });
      return false;
    }
    if (!this.selectedSemesterId) {
      this.snackBar.open('⚠️ Please select a semester', 'Close', { duration: 3000 });
      return false;
    }
    if (this.selectedStudentIds.length === 0) {
      this.snackBar.open('⚠️ Please select at least one student', 'Close', { duration: 3000 });
      return false;
    }
    if (this.selectedCourseIds.length === 0) {
      this.snackBar.open('⚠️ Please select at least one course', 'Close', { duration: 3000 });
      return false;
    }
    return true;
  }

  resetForm(): void {
    this.newBatchName = '';
    this.selectedSemesterId = undefined;
    this.selectedStudentIds = [];
    this.selectedCourseIds = [];
    this.studentFilter = '';
    this.courseFilter = '';
    this.filteredStudents = [...this.students];
    this.filteredCourses = [...this.courses];
  }

  removeEnrollment(id: number): void {
    const dialogRef = this.dialog.open(InlineConfirmDialog, {
      data: { title: 'Remove Enrollment', message: '⚠️ Do you really want to remove this enrollment?' }
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.enrollmentService.removeEnrollment(id).pipe(take(1)).subscribe({
          next: () => {
            this.snackBar.open('🗑️ Enrollment removed', 'Close', { duration: 3000 });
            this.loadEnrollments();
          },
          error: (err: any) =>
            this.snackBar.open('❌ Error: ' + (err?.message || err), 'Close', { duration: 4000 })
        });
      }
    });
  }

  deleteBatch(batchId: number): void {
    const dialogRef = this.dialog.open(InlineConfirmDialog, {
      data: { title: 'Delete Batch', message: '⚠️ Delete this batch and all its enrollments?' }
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.enrollmentService.deleteBatch(batchId).pipe(take(1)).subscribe({
          next: () => {
            this.snackBar.open('🗑️ Batch deleted', 'Close', { duration: 3000 });
            this.loadEnrollments();
            this.loadDropdowns();
          },
          error: (err: any) =>
            this.snackBar.open('❌ Error: ' + (err?.message || err), 'Close', { duration: 4000 })
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

  // Statistics
  get totalBatches(): number {
    return this.enrollmentTree.length;
  }

  get totalEnrollments(): number {
    return this.enrollments.length;
  }

  get totalStudents(): number {
    const uniqueStudents = new Set<number>();
    this.enrollments.forEach(e => uniqueStudents.add(e.student.id));
    return uniqueStudents.size;
  }

  // Filter batches
  filterBatches(): void {
    const filterValue = (this.batchSearchFilter ?? '').toLowerCase().trim();
    if (!filterValue) {
      this.filteredEnrollmentTree = this.enrollmentTree.length > 0 ? [...this.enrollmentTree] : [];
      return;
    }

    this.filteredEnrollmentTree = this.enrollmentTree.filter(batch =>
      batch.batchName.toLowerCase().includes(filterValue) ||
      (batch.semesterName && batch.semesterName.toLowerCase().includes(filterValue))
    );
  }

  // Helper methods for trackBy functions
  trackByBatchId(_: number, batch: EnrollmentTree): number {
    return batch.batchId;
  }

  trackByStudentId(_: number, student: { studentId: number }): number {
    return student.studentId;
  }

  trackByCourseId(_: number, course: { courseId: number }): number {
    return course.courseId;
  }

  getTotalCoursesInBatch(batch: EnrollmentTree): number {
    const courseSet = new Set<number>();
    batch.students.forEach(student => {
      student.courses.forEach(course => courseSet.add(course.courseId));
    });
    return courseSet.size;
  }

}

/* Inline confirmation dialog component */
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
