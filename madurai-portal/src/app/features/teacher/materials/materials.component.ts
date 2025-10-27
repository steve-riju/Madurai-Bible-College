import { Component, OnInit } from '@angular/core';
import { TeacherMaterialsService, Material } from '../services/teacher-materials.service';
import { AuthService } from '../../../shared/auth.service';

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
    this.materialService.uploadMaterial(
      this.selectedFile,
      this.title,
      this.description,
      this.selectedCourseId,
      this.teacherUsername
    ).subscribe(() => {
      this.loadMaterials(this.selectedCourseId!);
      this.resetForm();
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
  }
}
