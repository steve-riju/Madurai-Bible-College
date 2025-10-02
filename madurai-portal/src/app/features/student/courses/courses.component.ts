import { Component, OnInit } from '@angular/core';
import { StudentCoursesService, StudentCourse } from '../services/student-courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: StudentCourse[] = [];
  loading = true;
  error: string | null = null;
  selectedCourse: any = null;
  materials: any[] = [];
  loadingMaterials = false;

  constructor(private coursesService: StudentCoursesService) {}

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.error = 'Failed to load courses';
        this.loading = false;
      }
    });
  }

  viewMaterials(course: any) {
  this.selectedCourse = course;
  this.loadingMaterials = true;
  this.coursesService.getCourseMaterials(course.id).subscribe({
    next: (data) => {
      this.materials = data;
      this.loadingMaterials = false;
    },
    error: () => {
      this.loadingMaterials = false;
    }
  });
}

backToCourses() {
  this.selectedCourse = null;
  this.materials = [];
}
}
