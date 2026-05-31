import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminProfileService } from '../services/admin-profile.service';
import { ProfileCardDto, StudentProfileDto, TeacherProfileDto } from '../../../shared/models/profile.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-profiles',
  templateUrl: './admin-profiles.component.html',
  styleUrls: ['./admin-profiles.component.scss']
})
export class AdminProfilesComponent implements OnInit {
  cards: ProfileCardDto[] = [];
  loading = false;
  totalElements = 0;
  pageIndex = 0;
  pageSize = 12;
  pageSizeOptions = [12, 24, 48];

  filterRole = '';
  filterName = '';
  filterAcademicYear = '';
  filterSemester = '';
  filterBatch = '';
  filterProgram = '';

  apiUrl = environment.apiUrl;

  constructor(
    private adminProfileService: AdminProfileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.loading = true;
    this.adminProfileService.getProfiles(
      {
        role: this.filterRole || undefined,
        name: this.filterName || undefined,
        academicYear: this.filterAcademicYear || undefined,
        semester: this.filterSemester || undefined,
        batch: this.filterBatch || undefined,
        program: this.filterProgram || undefined
      },
      this.pageIndex,
      this.pageSize
    ).subscribe({
      next: (page) => {
        this.cards = page.content;
        this.totalElements = page.totalElements;

        this.cards.forEach(card => {

          card.photoUrl = 'assets/images/default-avatar.svg';

          if (card.profilePhotoPath) {

          this.adminProfileService.getPhoto(card.userId)
            .subscribe({
              next: (blob) => {
                card.photoUrl = URL.createObjectURL(blob);
              },
              error: () => {
                card.photoUrl = 'assets/images/default-avatar.svg';
              }
            });
        }
      });

      this.loading = false;
    },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load profiles.', 'Close', { duration: 4000 });
      }
    });
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.loadProfiles();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProfiles();
  }

  clearFilters(): void {
    this.filterRole = '';
    this.filterName = '';
    this.filterAcademicYear = '';
    this.filterSemester = '';
    this.filterBatch = '';
    this.filterProgram = '';
    this.pageIndex = 0;
    this.loadProfiles();
  }

  getPhotoUrl(card: ProfileCardDto): string {
    if (card.profilePhotoPath) {
      return `${this.apiUrl}/api/profile/photo/${card.userId}`;
    }
    return 'assets/images/default-avatar.svg';
  }

  onPhotoError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.svg';
  }

  viewStudent(card: ProfileCardDto): void {
    this.adminProfileService.getStudent(card.userId).subscribe({
      next: (profile) => {
        this.dialog.open(StudentViewDialogComponent, {
          width: '92%', maxWidth: '700px', data: profile
        });
      },
      error: () => this.snackBar.open('Failed to load student profile.', 'Close', { duration: 4000 })
    });
  }

  editStudent(card: ProfileCardDto): void {
    this.adminProfileService.getStudent(card.userId).subscribe({
      next: (profile) => {
        const ref = this.dialog.open(StudentEditDialogComponent, {
          width: '92%', maxWidth: '700px', data: profile
        });
        ref.afterClosed().subscribe(result => {
          if (result) {
            this.adminProfileService.updateStudent(card.userId, result).subscribe({
              next: () => { this.snackBar.open('Student profile updated.', 'Close', { duration: 4000 }); this.loadProfiles(); },
              error: (err) => this.snackBar.open(err?.error?.message || 'Update failed.', 'Close', { duration: 4000 })
            });
          }
        });
      },
      error: () => this.snackBar.open('Failed to load student profile.', 'Close', { duration: 4000 })
    });
  }

  viewTeacher(card: ProfileCardDto): void {
    this.adminProfileService.getTeacher(card.userId).subscribe({
      next: (profile) => {
        this.dialog.open(TeacherViewDialogComponent, {
          width: '92%', maxWidth: '700px', data: profile
        });
      },
      error: () => this.snackBar.open('Failed to load teacher profile.', 'Close', { duration: 4000 })
    });
  }

  editTeacher(card: ProfileCardDto): void {
    this.adminProfileService.getTeacher(card.userId).subscribe({
      next: (profile) => {
        const ref = this.dialog.open(TeacherEditDialogComponent, {
          width: '92%', maxWidth: '700px', data: profile
        });
        ref.afterClosed().subscribe(result => {
          if (result) {
            this.adminProfileService.updateTeacher(card.userId, result).subscribe({
              next: () => { this.snackBar.open('Teacher profile updated.', 'Close', { duration: 4000 }); this.loadProfiles(); },
              error: (err) => this.snackBar.open(err?.error?.message || 'Update failed.', 'Close', { duration: 4000 })
            });
          }
        });
      },
      error: () => this.snackBar.open('Failed to load teacher profile.', 'Close', { duration: 4000 })
    });
  }
}

// ─── Student View Dialog ─────────────────────────────────────────────────────
@Component({
  selector: 'app-student-view-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.firstName }} {{ data.lastName }}</h2>
    <mat-dialog-content class="dialog-content">
      <mat-expansion-panel expanded>
        <mat-expansion-panel-header><mat-panel-title>Personal & Contact</mat-panel-title></mat-expansion-panel-header>
        <div class="info-grid">
          <div class="info-item"><span class="lbl">Username</span><span>{{ data.username }}</span></div>
          <div class="info-item"><span class="lbl">Gender</span><span>{{ data.gender || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Date of Birth</span><span>{{ data.dateOfBirth || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Mobile</span><span>{{ data.primaryMobile || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Email</span><span>{{ data.personalEmail || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Address</span><span>{{ data.permanentAddress || '—' }}</span></div>
        </div>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header><mat-panel-title>Academic</mat-panel-title></mat-expansion-panel-header>
        <div class="info-grid">
          <div class="info-item"><span class="lbl">Student ID</span><span>{{ data.studentIdNumber || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Admission No.</span><span>{{ data.admissionNumber || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Batch</span><span>{{ data.batch || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Program</span><span>{{ data.program || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Semester</span><span>{{ data.semester || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Academic Year</span><span>{{ data.academicYear || '—' }}</span></div>
        </div>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header><mat-panel-title>Church & Ministry</mat-panel-title></mat-expansion-panel-header>
        <div class="info-grid">
          <div class="info-item"><span class="lbl">Home Church</span><span>{{ data.homeChurch || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Denomination</span><span>{{ data.churchDenomination || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Baptized</span><span>{{ data.baptized ? 'Yes' : 'No' }}</span></div>
        </div>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header><mat-panel-title>Guardian</mat-panel-title></mat-expansion-panel-header>
        <div class="info-grid">
          <div class="info-item"><span class="lbl">Father</span><span>{{ data.fatherName || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Mother</span><span>{{ data.motherName || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Guardian</span><span>{{ data.guardianName || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Guardian Phone</span><span>{{ data.guardianPhone || '—' }}</span></div>
        </div>
      </mat-expansion-panel>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-content { max-height: 70vh; overflow-y: auto; } .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 12px 0; } .info-item { display: flex; flex-direction: column; } .lbl { font-size: 11px; color: #777; text-transform: uppercase; font-weight: 600; } mat-expansion-panel { margin-bottom: 8px; }`]
})
export class StudentViewDialogComponent {
  constructor(public dialogRef: MatDialogRef<StudentViewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: StudentProfileDto) {}
}

// ─── Student Edit Dialog ─────────────────────────────────────────────────────
@Component({
  selector: 'app-student-edit-dialog',
  template: `
    <h2 mat-dialog-title>Edit Student: {{ data.firstName }} {{ data.lastName }}</h2>
    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form">
        <mat-expansion-panel expanded>
          <mat-expansion-panel-header><mat-panel-title>Personal Information</mat-panel-title></mat-expansion-panel-header>
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput formControlName="firstName" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput formControlName="lastName" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Primary Mobile</mat-label><input matInput formControlName="primaryMobile" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Personal Email</mat-label><input matInput formControlName="personalEmail" /></mat-form-field>
          </div>
        </mat-expansion-panel>
        <mat-expansion-panel>
          <mat-expansion-panel-header><mat-panel-title>Academic Information</mat-panel-title></mat-expansion-panel-header>
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>Student ID</mat-label><input matInput formControlName="studentIdNumber" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Admission No.</mat-label><input matInput formControlName="admissionNumber" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Batch</mat-label><input matInput formControlName="batch" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Academic Year</mat-label><input matInput formControlName="academicYear" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Program</mat-label><input matInput formControlName="program" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Semester</mat-label><input matInput formControlName="semester" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Admission Date</mat-label><input matInput type="date" formControlName="admissionDate" /></mat-form-field>
          </div>
        </mat-expansion-panel>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-content { max-height: 70vh; overflow-y: auto; } .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px 0; } mat-form-field { width: 100%; } mat-expansion-panel { margin-bottom: 8px; }`]
})
export class StudentEditDialogComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<StudentEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: StudentProfileDto) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.data.firstName || ''],
      lastName: [this.data.lastName || ''],
      primaryMobile: [this.data.primaryMobile || '', [Validators.pattern('^[0-9]{10}$')]],
      personalEmail: [this.data.personalEmail || '', [Validators.email]],
      studentIdNumber: [this.data.studentIdNumber || ''],
      admissionNumber: [this.data.admissionNumber || ''],
      batch: [this.data.batch || ''],
      academicYear: [this.data.academicYear || ''],
      program: [this.data.program || ''],
      semester: [this.data.semester || ''],
      admissionDate: [this.data.admissionDate || '']
    });
  }
  save(): void { if (this.form.valid) this.dialogRef.close(this.form.value); }
}

// ─── Teacher View Dialog ─────────────────────────────────────────────────────
@Component({
  selector: 'app-teacher-view-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.firstName }} {{ data.lastName }}</h2>
    <mat-dialog-content class="dialog-content">
      <mat-expansion-panel expanded>
        <mat-expansion-panel-header><mat-panel-title>Personal & Contact</mat-panel-title></mat-expansion-panel-header>
        <div class="info-grid">
          <div class="info-item"><span class="lbl">Username</span><span>{{ data.username }}</span></div>
          <div class="info-item"><span class="lbl">Mobile</span><span>{{ data.primaryMobile || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Email</span><span>{{ data.personalEmail || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Address</span><span>{{ data.permanentAddress || '—' }}</span></div>
        </div>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header><mat-panel-title>Employment</mat-panel-title></mat-expansion-panel-header>
        <div class="info-grid">
          <div class="info-item"><span class="lbl">Employee ID</span><span>{{ data.employeeId || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Designation</span><span>{{ data.designation || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Employment Type</span><span>{{ data.employmentType || '—' }}</span></div>
        </div>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header><mat-panel-title>Church & Ministry</mat-panel-title></mat-expansion-panel-header>
        <div class="info-grid">
          <div class="info-item"><span class="lbl">Home Church</span><span>{{ data.homeChurch || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Denomination</span><span>{{ data.churchDenomination || '—' }}</span></div>
          <div class="info-item"><span class="lbl">Baptized</span><span>{{ data.baptized ? 'Yes' : 'No' }}</span></div>
        </div>
      </mat-expansion-panel>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-content { max-height: 70vh; overflow-y: auto; } .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 12px 0; } .info-item { display: flex; flex-direction: column; } .lbl { font-size: 11px; color: #777; text-transform: uppercase; font-weight: 600; } mat-expansion-panel { margin-bottom: 8px; }`]
})
export class TeacherViewDialogComponent {
  constructor(public dialogRef: MatDialogRef<TeacherViewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: TeacherProfileDto) {}
}

// ─── Teacher Edit Dialog ─────────────────────────────────────────────────────
@Component({
  selector: 'app-teacher-edit-dialog',
  template: `
    <h2 mat-dialog-title>Edit Teacher: {{ data.firstName }} {{ data.lastName }}</h2>
    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form">
        <mat-expansion-panel expanded>
          <mat-expansion-panel-header><mat-panel-title>Personal Information</mat-panel-title></mat-expansion-panel-header>
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput formControlName="firstName" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput formControlName="lastName" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Primary Mobile</mat-label><input matInput formControlName="primaryMobile" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Personal Email</mat-label><input matInput formControlName="personalEmail" /></mat-form-field>
          </div>
        </mat-expansion-panel>
        <mat-expansion-panel>
          <mat-expansion-panel-header><mat-panel-title>Employment Information</mat-panel-title></mat-expansion-panel-header>
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>Employee ID</mat-label><input matInput formControlName="employeeId" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Designation</mat-label><input matInput formControlName="designation" /></mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Employment Type</mat-label>
              <mat-select formControlName="employmentType">
                <mat-option value="FULL_TIME">Full Time</mat-option>
                <mat-option value="PART_TIME">Part Time</mat-option>
                <mat-option value="GUEST_FACULTY">Guest Faculty</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-expansion-panel>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-content { max-height: 70vh; overflow-y: auto; } .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px 0; } mat-form-field { width: 100%; } mat-expansion-panel { margin-bottom: 8px; }`]
})
export class TeacherEditDialogComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<TeacherEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: TeacherProfileDto) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.data.firstName || ''],
      lastName: [this.data.lastName || ''],
      primaryMobile: [this.data.primaryMobile || '', [Validators.pattern('^[0-9]{10}$')]],
      personalEmail: [this.data.personalEmail || '', [Validators.email]],
      employeeId: [this.data.employeeId || ''],
      designation: [this.data.designation || ''],
      employmentType: [this.data.employmentType || '']
    });
  }
  save(): void { if (this.form.valid) this.dialogRef.close(this.form.value); }
}
