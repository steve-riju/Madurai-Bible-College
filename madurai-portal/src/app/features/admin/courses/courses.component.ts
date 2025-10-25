import { Component, OnInit } from '@angular/core';
import { AdminCoursesService, Course, Semester, CourseAssignment, Teacher } from '../services/admin-courses.service';
import { ErrorUtilsService } from '../../../shared/services/error-utils.service';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];
  semesters: Semester[] = [];
  teachers: Teacher[] = [];
  assignments: CourseAssignment[] = [];

  // form models (template-driven)
  newCourse: Course = { code: '', name: '', credits: '' };
  newSemester: Semester = { name: '', startDate: '', endDate: '' };
  assignment: CourseAssignment = { courseId: null, semesterId: null, teacherId: null };
  

  // UI state
  loading = false;
  errorMsg = '';
  successMsg = '';
  savingCourse = false;
  savingSemester = false;
  assigning = false;
  deletingCourseId: number | null = null;
  deletingSemesterId: number | null = null;
  unassigningId: number | null = null;


  // inline confirmations
  confirmDeleteCourseId: number | null = null;
  confirmDeleteSemesterId: number | null = null;
  confirmUnassignId: number | null = null;

  constructor(
    private courseService: AdminCoursesService,
    private errorUtils: ErrorUtilsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private handleError(err: any) {
    // This method is now handled by the global error interceptor
    // Keep this for any component-specific error handling if needed
    console.error('Component Error:', err);
  }

  private handleSuccess(msg: string) {
    this.errorUtils.showSuccess(msg);
  }

  /** Load all initial data */
  loadData() {
    this.loading = true;
    this.errorMsg = '';
    Promise.all([
      this.courseService.getCourses().toPromise().then(c => (this.courses = c ?? [])),
      this.courseService.getSemesters().toPromise().then(s => (this.semesters = s ?? [])),
      this.courseService.getTeachers().toPromise().then(t => (this.teachers = t ?? [])),
      this.courseService.getAssignments().toPromise().then(a => (this.assignments = a ?? [])),
    ])
      .catch((err) => {
        this.handleError(err);
        this.errorUtils.handleError(err, { component: 'AdminCourses', action: 'loadData' });
      })
      .finally(() => (this.loading = false));
  }

  /** Add new course (guarded by template validations) */
  addCourse() {
  if (!this.newCourse.code || !this.newCourse.name || this.newCourse.credits == null) {
    this.errorUtils.showWarning('All fields are required.', 'Validation Error');
    return;
  }
  this.savingCourse = true;
  this.courseService.createCourse(this.newCourse).subscribe({
    next: () => {
      this.newCourse = { code: '', name: '', credits: 0 };
      this.handleSuccess('Course created successfully!');
      this.loadData();
    },
    error: (err) => {
      this.handleError(err);
      this.errorUtils.handleError(err, { component: 'AdminCourses', action: 'addCourse' });
    },
    complete: () => (this.savingCourse = false),
  });
}

  /** Add new semester (guarded by template validations) */
 addSemester() {
  if (!this.newSemester.name || !this.newSemester.startDate || !this.newSemester.endDate) {
    this.errorUtils.showWarning('All fields are required.', 'Validation Error');
    return;
  }
  this.savingSemester = true;
  this.courseService.createSemester(this.newSemester).subscribe({
    next: () => {
      this.newSemester = { name: '', startDate: '', endDate: '' };
      this.handleSuccess('Semester created successfully!');
      this.loadData();
    },
    error: (err) => {
      this.handleError(err);
      this.errorUtils.handleError(err, { component: 'AdminCourses', action: 'addSemester' });
    },
    complete: () => (this.savingSemester = false),
  });
}

  /** Assign teacher to course + semester (guarded by template validations) */
  assignTeacher() {
  if (!this.assignment.courseId || !this.assignment.semesterId || !this.assignment.teacherId) {
    this.errorUtils.showWarning('All fields are required.', 'Validation Error');
    return;
  }
  this.assigning = true;
  this.courseService.assignTeacher(this.assignment).subscribe({
    next: () => {
      this.assignment = { courseId: 0, semesterId: 0, teacherId: 0 };
      this.handleSuccess('Teacher assigned successfully!');
      this.loadData();
    },
    error: (err) => {
      this.handleError(err);
      this.errorUtils.handleError(err, { component: 'AdminCourses', action: 'assignTeacher' });
    },
    complete: () => (this.assigning = false),
  });
}

  /** Ask inline confirmation for delete course */
  askDeleteCourse(id: number) {
    this.confirmDeleteCourseId = id;
  }
  cancelDeleteCourse() {
    this.confirmDeleteCourseId = null;
  }
  deleteCourse(id: number) {
  this.errorMsg = '';
  this.deletingCourseId = id;
  this.courseService.deleteCourse(id).subscribe({
    next: () => {
      this.confirmDeleteCourseId = null;
      this.handleSuccess('Course deleted.');
      this.loadData();
    },
    error: (err) => this.handleError(err),
    complete: () => (this.deletingCourseId = null),
  });
}

  /** Ask inline confirmation for delete semester */
  askDeleteSemester(id: number) {
    this.confirmDeleteSemesterId = id;
  }
  cancelDeleteSemester() {
    this.confirmDeleteSemesterId = null;
  }
  deleteSemester(id: number) {
  this.errorMsg = '';
  this.deletingSemesterId = id;
  this.courseService.deleteSemester(id).subscribe({
    next: () => {
      this.confirmDeleteSemesterId = null;
      this.handleSuccess('Semester deleted.');
      this.loadData();
    },
    error: (err) => this.handleError(err),
    complete: () => (this.deletingSemesterId = null),
  });
}

  /** Ask inline confirmation for unassign */
  askUnassign(id: number) {
    this.confirmUnassignId = id;
  }
  cancelUnassign() {
    this.confirmUnassignId = null;
  }
  deleteAssignment(id: number) {
  this.errorMsg = '';
  this.unassigningId = id;
  this.courseService.deleteAssignment(id).subscribe({
    next: () => {
      this.confirmUnassignId = null;
      this.handleSuccess('Teacher unassigned.');
      this.loadData();
    },
    error: (err) => this.handleError(err),
    complete: () => (this.unassigningId = null),
  });
}

  // helpers for display
  courseNameById(id?: number | null) {
    return this.courses.find(c => c.id === id)?.name || id;
  }
  semesterNameById(id?: number | null) {
    return this.semesters.find(s => s.id === id)?.name || id;
  }
}
