import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentCoursesService } from  '../services/student-courses.service';

@Component({
  selector: 'app-course-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  @Input() courseId!: number;   // passed from parent (courses view)
  materials: any[] = [];

  constructor(
    private courseService: StudentCoursesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.courseId) {
      this.courseService.getCourseMaterials(this.courseId).subscribe({
        next: (res) => {
          this.materials = res;
        },
        error: (err) => console.error('Failed to fetch materials', err)
      });
    }
  }

  getSafeUrl(fileUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  getFileType(fileUrl: string): string {
    if (!fileUrl) return 'unknown';
    if (fileUrl.endsWith('.pdf')) return 'pdf';
    if (fileUrl.endsWith('.pptx')) return 'pptx';
    if (fileUrl.endsWith('.ppt')) return 'ppt';
    if (fileUrl.endsWith('.doc')) return 'pdf';
    if (fileUrl.match(/\.(jpg|jpeg|png|gif)$/i)) return 'image';
    if (fileUrl.match(/\.(txt|md)$/i)) return 'text';
    return 'other';
  }
}
