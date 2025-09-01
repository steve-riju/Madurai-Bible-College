import { Component, OnInit } from '@angular/core';
import { AdminCoursesService, Course, Semester, CourseAssignment, Teacher } from '../services/admin-courses.service';

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
  newCourse: Course = { code: '', name: '', credits: 0 };
  newSemester: Semester = { name: '', startDate: '', endDate: '' };
  assignment: CourseAssignment = { courseId: 0, semesterId: 0, teacherId: 0 };
  

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

  constructor(private courseService: AdminCoursesService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private handleError(err: any) {
    console.error('API Error:', err);

  let apiMessage: string | undefined;

  if (err?.error?.message) {
    // case: { message: "..." }
    apiMessage = err.error.message;

  } else if (err?.error?.error) {
    // case: { error: "..." }
    apiMessage = err.error.error;

  } else if (typeof err?.error === 'string') {
    // case: plain text
    apiMessage = err.error;

  } else if (err?.message) {
    apiMessage = err.message;
  }

  // Map common backend exceptions to user-friendly text
  if (apiMessage?.includes('SQLIntegrityConstraintViolationException')) {
    apiMessage = 'This item cannot be deleted because it is linked with other records.';
  } else if (apiMessage?.includes('ConstraintViolationException')) {
    apiMessage = 'Invalid input. Please check the values and try again.';
  } else if (apiMessage?.includes('User is not a teacher')) {
    apiMessage = 'Selected user is not a teacher.';
  }

  this.errorMsg = apiMessage || 'Something went wrong. Please try again.';
  setTimeout(() => (this.errorMsg = ''), 6000);
}


  private handleSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => (this.successMsg = ''), 4000);
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
      .catch((err) => this.handleError(err))
      .finally(() => (this.loading = false));
  }

  /** Add new course (guarded by template validations) */
  addCourse() {
  if (!this.newCourse.code || !this.newCourse.name || this.newCourse.credits == null) {
    this.handleError({ message: 'All fields are required.' });
    return;
  }
  this.savingCourse = true;
  this.courseService.createCourse(this.newCourse).subscribe({
    next: () => {
      this.newCourse = { code: '', name: '', credits: 0 };
      this.handleSuccess('Course created.');
      this.loadData();
    },
    error: (err) => this.handleError(err),
    complete: () => (this.savingCourse = false),
  });
}

  /** Add new semester (guarded by template validations) */
 addSemester() {
  if (!this.newSemester.name || !this.newSemester.startDate || !this.newSemester.endDate) {
    this.handleError({ message: 'All fields are required.' });
    return;
  }
  this.savingSemester = true;
  this.courseService.createSemester(this.newSemester).subscribe({
    next: () => {
      this.newSemester = { name: '', startDate: '', endDate: '' };
      this.handleSuccess('Semester created.');
      this.loadData();
    },
    error: (err) => this.handleError(err),
    complete: () => (this.savingSemester = false),
  });
}

  /** Assign teacher to course + semester (guarded by template validations) */
  assignTeacher() {
  if (!this.assignment.courseId || !this.assignment.semesterId || !this.assignment.teacherId) {
    this.handleError({ message: 'All fields are required.' });
    return;
  }
  this.assigning = true;
  this.courseService.assignTeacher(this.assignment).subscribe({
    next: () => {
      this.assignment = { courseId: 0, semesterId: 0, teacherId: 0 };
      this.handleSuccess('Teacher assigned.');
      this.loadData();
    },
    error: (err) => this.handleError(err),
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
  courseNameById(id?: number) {
    return this.courses.find(c => c.id === id)?.name || id;
  }
  semesterNameById(id?: number) {
    return this.semesters.find(s => s.id === id)?.name || id;
  }
}
