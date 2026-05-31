import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../shared/auth.service';
import { ProfileService } from '../../../shared/services/profile.service';
import { StudentProfileDto } from '../../../shared/models/profile.model';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: StudentProfileDto | null = null;
  loading = false;
  saving = false;
  photoLoading = false;
  photoPreviewUrl: string | null = null;
  selectedFile: File | null = null;
  userId: number | null = null;

  personalForm!: FormGroup;
  contactForm!: FormGroup;
  churchForm!: FormGroup;
  guardianForm!: FormGroup;
  preferencesForm!: FormGroup;
  passwordForm!: FormGroup;

  genderOptions = ['MALE', 'FEMALE', 'OTHER'];
  maritalStatusOptions = ['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED'];
  languageOptions = ['ENGLISH', 'TAMIL'];

  photoUrl: string = 'assets/images/default-avatar.svg';

  ngOnDestroy(): void {
    this.revokeCurrentPhotoUrl();
  }

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getId();
    this.buildForms();
    this.loadProfile();
  }

  private buildForms(): void {
    this.personalForm = this.fb.group({
      firstName: ['', [Validators.maxLength(100)]],
      lastName: ['', [Validators.maxLength(100)]],
      preferredName: ['', [Validators.maxLength(100)]],
      gender: [''],
      dateOfBirth: [''],
      maritalStatus: ['']
    });

    this.contactForm = this.fb.group({
      primaryMobile: ['', [Validators.pattern('^[0-9]{10}$')]],
      alternateMobile: ['', [Validators.pattern('^[0-9]{10}$')]],
      personalEmail: ['', [Validators.email]],
      permanentAddress: ['', [Validators.maxLength(500)]],
      emergencyContactName: ['', [Validators.maxLength(150)]],
      emergencyContactRelationship: ['', [Validators.maxLength(100)]],
      emergencyContactPhone: ['', [Validators.pattern('^[0-9]{10}$')]]
    });

    this.churchForm = this.fb.group({
      homeChurch: ['', [Validators.maxLength(200)]],
      churchDenomination: ['', [Validators.maxLength(200)]],
      baptized: [false],
      ministryExperience: ['', [Validators.maxLength(1000)]],
      ministryInterests: ['', [Validators.maxLength(500)]],
      callingTestimony: ['', [Validators.maxLength(2000)]]
    });

    this.guardianForm = this.fb.group({
      fatherName: ['', [Validators.maxLength(150)]],
      motherName: ['', [Validators.maxLength(150)]],
      guardianName: ['', [Validators.maxLength(150)]],
      guardianRelationship: ['', [Validators.maxLength(100)]],
      guardianPhone: ['', [Validators.pattern('^[0-9]{10}$')]]
    });

    this.preferencesForm = this.fb.group({
      languagePreference: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  loadProfile(): void {
  this.loading = true;

  this.profileService.getMyProfile().subscribe({
    next: (data) => {
      this.profile = data as StudentProfileDto;
      this.patchForms(this.profile);

      // Load profile photo
      if (this.userId) {
        this.profileService.getPhoto(this.userId).subscribe({
          next: (blob) => {
            this.revokeCurrentPhotoUrl();
            this.photoUrl = URL.createObjectURL(blob);
          },
          error: () => {
            this.photoUrl = 'assets/images/default-avatar.svg';
          }
        });
      }

      this.loading = false;
    },
    error: () => {
      this.loading = false;

      const cached = localStorage.getItem('studentProfile');
      if (cached) {
        this.profile = JSON.parse(cached);

        if (this.profile) {
          this.patchForms(this.profile);
        }
      }

      this.snackBar.open(
        'Could not load profile. Showing cached data.',
        'Close',
        { duration: 4000 }
      );
    }
  });
}

  private revokeCurrentPhotoUrl(): void {
    if (
      this.photoUrl &&
      this.photoUrl.startsWith('blob:')
    ) {
      URL.revokeObjectURL(this.photoUrl);
    }
  }

  private patchForms(p: StudentProfileDto): void {
    this.personalForm.patchValue({
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      preferredName: p.preferredName || '',
      gender: p.gender || '',
      dateOfBirth: p.dateOfBirth || '',
      maritalStatus: p.maritalStatus || ''
    });
    this.contactForm.patchValue({
      primaryMobile: p.primaryMobile || '',
      alternateMobile: p.alternateMobile || '',
      personalEmail: p.personalEmail || '',
      permanentAddress: p.permanentAddress || '',
      emergencyContactName: p.emergencyContactName || '',
      emergencyContactRelationship: p.emergencyContactRelationship || '',
      emergencyContactPhone: p.emergencyContactPhone || ''
    });
    this.churchForm.patchValue({
      homeChurch: p.homeChurch || '',
      churchDenomination: p.churchDenomination || '',
      baptized: p.baptized || false,
      ministryExperience: p.ministryExperience || '',
      ministryInterests: p.ministryInterests || '',
      callingTestimony: p.callingTestimony || ''
    });
    this.guardianForm.patchValue({
      fatherName: p.fatherName || '',
      motherName: p.motherName || '',
      guardianName: p.guardianName || '',
      guardianRelationship: p.guardianRelationship || '',
      guardianPhone: p.guardianPhone || ''
    });
    this.preferencesForm.patchValue({ languagePreference: p.languagePreference || '' });
    localStorage.setItem('studentProfile', JSON.stringify(p));
  }

  savePersonal(): void {
    if (this.personalForm.invalid) return;
    this.saving = true;
    this.profileService.updateMyProfile(this.personalForm.value).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.saving = false;
        this.snackBar.open('Personal information saved.', 'Close', { duration: 4000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Failed to save personal information.', 'Close', { duration: 4000 });
      }
    });
  }

  saveContact(): void {
    if (this.contactForm.invalid) return;
    this.saving = true;
    this.profileService.updateMyProfile(this.contactForm.value).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.saving = false;
        this.snackBar.open('Contact information saved.', 'Close', { duration: 4000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Failed to save contact information.', 'Close', { duration: 4000 });
      }
    });
  }

  saveChurch(): void {
    if (this.churchForm.invalid) return;
    this.saving = true;
    this.profileService.updateMyProfile(this.churchForm.value).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.saving = false;
        this.snackBar.open('Church & Ministry information saved.', 'Close', { duration: 4000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Failed to save church information.', 'Close', { duration: 4000 });
      }
    });
  }

  saveGuardian(): void {
    if (this.guardianForm.invalid) return;
    this.saving = true;
    this.profileService.updateMyProfile(this.guardianForm.value).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.saving = false;
        this.snackBar.open('Guardian information saved.', 'Close', { duration: 4000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Failed to save guardian information.', 'Close', { duration: 4000 });
      }
    });
  }

  savePreferences(): void {
    this.saving = true;
    this.profileService.updateMyProfile(this.preferencesForm.value).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.saving = false;
        this.snackBar.open('Preferences saved.', 'Close', { duration: 4000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Failed to save preferences.', 'Close', { duration: 4000 });
      }
    });
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];

    const file = input.files[0];

    if (file.size > 5 * 1024 * 1024) {
      this.snackBar.open(
        'Maximum file size is 5 MB',
        'Close',
        { duration: 4000 }
      );
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.snackBar.open(
        'Please select a valid image',
        'Close',
        { duration: 4000 }
      );
      return;
    }

    if (this.photoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }

    this.photoPreviewUrl = URL.createObjectURL(this.selectedFile);
  }
}

  uploadPhoto(): void {
    if (!this.selectedFile) return;
    this.photoLoading = true;
    this.profileService.uploadPhoto(this.selectedFile).subscribe({
      next: () => { this.photoLoading = false; this.selectedFile = null; 
      this.photoPreviewUrl = null;

      // Clear cached profile
      localStorage.removeItem('studentProfile');

      // Release old blob URL
      this.revokeCurrentPhotoUrl();

      this.snackBar.open('Profile photo updated.', 'Close', { duration: 4000 });
      this.loadProfile(); },
      error: () => { this.photoLoading = false; this.snackBar.open('Failed to upload photo.', 'Close', { duration: 4000 }); }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    this.saving = true;
    this.profileService.changePassword({ currentPassword, newPassword, confirmPassword }).subscribe({
      next: (res) => {
        this.saving = false;
        this.passwordForm.reset();
        this.snackBar.open(res.message, 'Close', { duration: 4000 });
      },
      error: (err) => {
        this.saving = false;
        const msg = err?.error?.message || 'Failed to change password.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  getPhotoUrl(): string {
    if (this.photoPreviewUrl) return this.photoPreviewUrl;
    if (this.userId) return this.profileService.getPhotoUrl(this.userId);
    return 'assets/images/default-avatar.svg';
  }

  onPhotoError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.svg';
  }
}
