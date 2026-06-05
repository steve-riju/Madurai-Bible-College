import { Component, OnInit } from '@angular/core';
import { TeacherMaterialsService, Material } from '../services/teacher-materials.service';
import { AuthService } from '../../../shared/auth.service';
import {  HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  teacherUsername!: string;
  courses: any[] = [];
  materials: { [courseId: number]: Material[] } = {};
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
  fileError: string | null = null;

  // Form state
  selectedFile: File | null = null;
  title = '';
  description = '';
  selectedCourseId: number | null = null;
  editingMaterial: Material | null = null;

  uploadProgress = 0;
  uploading = false;
  uploadedSize = '';
  totalSize = '';
  uploadSpeed = '';
  remainingTime = '';
  uploadCompleted = false;
  uploadStatusMessage = '';

  private uploadStartTime = 0;

  constructor(
    private materialService: TeacherMaterialsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.teacherUsername = this.authService.getUsername()!; // ✅ now we use username
    this.loadCourses();
  }

  loadCourses() {
    this.materialService.getAssignedCourses(this.teacherUsername).subscribe(courses => {
      this.courses = courses;
      courses.forEach(c => this.loadMaterials(c.id));
    });
  }

  loadMaterials(courseId: number) {
    this.materialService.getByCourse(courseId).subscribe(res => {
      this.materials[courseId] = res;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > this.MAX_FILE_SIZE) {
      this.fileError = `File "${file.name}" exceeds the 50MB size limit`;
      this.selectedFile = null;
      return;
    }
    
    this.fileError = null;
    this.selectedFile = file;
  }

  uploadMaterial() {

  if (!this.selectedFile || !this.selectedCourseId) {
    alert('Please select a file and course');
    return;
  }

  this.uploading = true;
  this.uploadProgress = 0;
  this.uploadStartTime = Date.now();
  this.materialService.uploadMaterial(
    this.selectedFile,
    this.title,
    this.description,
    this.selectedCourseId,
    this.teacherUsername
  )
  .subscribe({
    next: (event) => {
      if (event.type === HttpEventType.UploadProgress) {
          const loaded = event.loaded;
          const total = event.total || 1;

          this.uploadProgress = Math.round((loaded / total) * 100);

          this.uploadedSize = this.formatBytes(loaded);

          this.totalSize = this.formatBytes(total);

          const elapsedSeconds = (Date.now() - this.uploadStartTime) / 1000;

          const bytesPerSecond = loaded / Math.max(elapsedSeconds, 1);

          this.uploadSpeed = `${this.formatBytes(bytesPerSecond)}/s`;

          const remainingBytes = total - loaded;

          const remainingSeconds = remainingBytes / Math.max(bytesPerSecond, 1);

          this.remainingTime = this.formatTime(remainingSeconds);
        }

        if (event.type === HttpEventType.Response) {

          this.uploadProgress = 100;
          this.uploading = false;

          this.uploadCompleted = true;
          this.uploadStatusMessage = 'Upload completed successfully';

          this.loadMaterials(this.selectedCourseId!);

          setTimeout(() => {
            this.resetForm();
          }, 2000);
        }

    },

      error: (err) => {

        this.uploading = false;
        this.uploadCompleted = false;

        this.uploadStatusMessage = 'Upload failed';

        console.error(err);

        setTimeout(() => {
          this.uploadStatusMessage = '';
        }, 3000);
      }

    });

}

  editMaterial(material: Material) {
    this.editingMaterial = { ...material };
    this.title = material.title;
    this.description = material.description;
    this.selectedCourseId = material.courseId;

    const formElement = document.getElementById('form-group');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  }

  saveEdit() {
    if (!this.editingMaterial) return;

    this.materialService.updateMaterial(
      this.editingMaterial.id,
      this.title,
      this.description
    ).subscribe(() => {
      this.loadMaterials(this.editingMaterial!.courseId);
      this.resetForm();
    });
  }

  deleteMaterial(material: Material) {
    if (!confirm('Are you sure you want to delete this material?')) return;

    this.materialService.deleteMaterial(material.id).subscribe(() => {
      this.loadMaterials(material.courseId);
    });
  }

  resetForm() {
    this.selectedFile = null;
    this.title = '';
    this.description = '';
    this.selectedCourseId = null;
    this.editingMaterial = null;

    this.fileError = null;

    this.uploadProgress = 0;
    this.uploading = false;

    this.uploadCompleted = false;
    this.uploadStatusMessage = '';

    this.uploadedSize = '';
    this.totalSize = '';
    this.uploadSpeed = '';
    this.remainingTime = '';
  }

  formatBytes(bytes: number): string {

  if (!bytes) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(1)} ${units[i]}`;
}

formatTime(seconds: number): string {

  if (!isFinite(seconds) || seconds < 0) {
    return '--';
  }

  if (seconds < 60) {
    return `${Math.ceil(seconds)} sec`;
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.ceil(seconds % 60);

  return `${mins}m ${secs}s`;
}
}
