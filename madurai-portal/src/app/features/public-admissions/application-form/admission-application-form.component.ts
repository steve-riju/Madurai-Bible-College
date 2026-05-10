import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdmissionForm, AdmissionFormField } from '../../../shared/models/admission.model';
import { PublicAdmissionsService } from '../services/public-admissions.service';

@Component({
  selector: 'app-admission-application-form',
  templateUrl: './admission-application-form.component.html',
  styleUrls: ['./admission-application-form.component.scss']
})
export class AdmissionApplicationFormComponent implements OnInit {
  admissionForm?: AdmissionForm;
  applicationForm!: FormGroup;
  loading = false;
  submitting = false;
  submitted = false;
  error = '';
  submissionId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private admissionsService: PublicAdmissionsService
  ) {
    this.applicationForm = this.fb.group({});
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.router.navigate(['/admissions']);
      return;
    }
    this.loadForm(slug);
  }

  loadForm(slug: string): void {
    this.loading = true;
    this.error = '';
    this.admissionsService.getForm(slug).subscribe({
      next: form => {
        this.admissionForm = form;
        this.buildForm(form);
        this.loading = false;
      },
      error: () => {
        this.error = 'This admission form is not available.';
        this.loading = false;
      }
    });
  }

  buildForm(form: AdmissionForm): void {
    const controls: Record<string, any> = {};
    form.fields.forEach(field => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
      if (field.key === 'age') validators.push(Validators.min(1), Validators.max(120));
      if (field.key === 'whatsappNumber') validators.push(Validators.pattern(/^[0-9+\-\s]{10}$/));

      const initialValue = field.key === 'courseApplied' ? form.title : '';
      controls[field.key] = [initialValue, validators];
    });
    this.applicationForm = this.fb.group(controls);
  }

  submit(): void {
    if (!this.admissionForm || !this.admissionForm.open || this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';
    const answers = this.applicationForm.getRawValue();

    this.admissionsService.submitApplication({
      formId: this.admissionForm.id,
      answers
    }).subscribe({
      next: submission => {
        this.submissionId = submission.id;
        this.submitted = true;
        this.submitting = false;
        this.snackBar.open('Application submitted successfully', 'Close', { duration: 3000 });
      },
      error: err => {
        this.error = this.extractError(err);
        this.submitting = false;
      }
    });
  }

  fieldError(field: AdmissionFormField): string {
    const control = this.applicationForm.get(field.key);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) return `${field.label} is required.`;
    if (control.errors['maxlength']) return `${field.label} is too long.`;
    if (control.errors['min'] || control.errors['max']) return `${field.label} must be between 1 and 120.`;
    if (control.errors['pattern']) return `${field.label} is invalid.`;
    return `${field.label} is invalid.`;
  }

  private extractError(err: any): string {
    if (err?.error?.details?.length) {
      return err.error.details.join(' ');
    }
    if (err?.error?.message) {
      return err.error.message;
    }
    if (typeof err?.error === 'string') {
      return err.error;
    }
    return 'Unable to submit the application. Please check the form and try again.';
  }
}
