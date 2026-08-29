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
  private readonly otherValue = 'other';

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
      if (field.key === 'email' || field.type === 'email') validators.push(Validators.email);
      if (field.key === 'whatsappNumber') validators.push(Validators.pattern(/^[0-9+\-\s]{10}$/));

      const initialValue = field.key === 'courseApplied' ? form.title : '';
      controls[field.key] = [initialValue, validators];

      if (this.fieldHasOtherOption(field)) {
        const otherValidators = [];
        if (field.maxLength) otherValidators.push(Validators.maxLength(field.maxLength));
        controls[this.otherControlName(field)] = ['', otherValidators];
      }
    });
    this.applicationForm = this.fb.group(controls);

    form.fields
      .filter(field => this.fieldHasOtherOption(field))
      .forEach(field => this.configureOtherControl(field));
  }

  submit(): void {
    if (!this.admissionForm || !this.admissionForm.open || this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';
    const answers = this.buildAnswers();

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

  otherFieldError(field: AdmissionFormField): string {
    const control = this.applicationForm.get(this.otherControlName(field));
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) return `${field.label} is required.`;
    if (control.errors['maxlength']) return `${field.label} is too long.`;
    return `${field.label} is invalid.`;
  }

  fieldHasOtherOption(field: AdmissionFormField): boolean {
    return field.type === 'select' && (field.options || []).some(option => this.isOtherOption(option));
  }

  isOtherSelected(field: AdmissionFormField): boolean {
    return this.isOtherOption(this.applicationForm.get(field.key)?.value);
  }

  otherControlName(field: AdmissionFormField): string {
    return `${field.key}Other`;
  }

  private configureOtherControl(field: AdmissionFormField): void {
    const selectControl = this.applicationForm.get(field.key);
    const otherControl = this.applicationForm.get(this.otherControlName(field));
    if (!selectControl || !otherControl) return;

    const updateValidators = (value: string) => {
      const validators = [];
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
      if (this.isOtherOption(value) && field.required) validators.push(Validators.required);
      otherControl.setValidators(validators);
      if (!this.isOtherOption(value)) {
        otherControl.setValue('', { emitEvent: false });
      }
      otherControl.updateValueAndValidity({ emitEvent: false });
    };

    updateValidators(selectControl.value);
    selectControl.valueChanges.subscribe(updateValidators);
  }

  private buildAnswers(): Record<string, string> {
    const raw = this.applicationForm.getRawValue();
    const answers: Record<string, string> = {};
    this.admissionForm?.fields.forEach(field => {
      answers[field.key] = this.fieldHasOtherOption(field) && this.isOtherOption(raw[field.key])
        ? raw[this.otherControlName(field)]
        : raw[field.key];
    });
    return answers;
  }

  private isOtherOption(value?: string): boolean {
    return (value || '').trim().toLowerCase() === this.otherValue;
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
    return 'Unable to submit the application. Please check the form and try again or connect with 85900 89384.';
  }
}
