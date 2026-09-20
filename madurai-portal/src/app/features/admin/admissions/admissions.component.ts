import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AdmissionForm, AdmissionSubmission } from '../../../shared/models/admission.model';
import { ErrorUtilsService } from '../../../shared/services/error-utils.service';
import { AdminAdmissionsService, AdmissionFormPayload } from '../services/admin-admissions.service';

@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.scss']
})
export class AdmissionsComponent implements OnInit {
  activeView: 'forms' | 'submissions' = 'forms';
  forms: AdmissionForm[] = [];
  submissions: AdmissionSubmission[] = [];
  selectedSubmission?: AdmissionSubmission;
  selectedFormFilter = '';
  statusFilter = '';
  searchTerm = '';
  selectedExportCourses: string[] = [];
  loadingForms = false;
  loadingSubmissions = false;
  savingForm = false;
  editingFormId?: number;
  confirmArchiveId?: number;
  deadlineEdits: Record<number, string> = {};

  formGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private admissionsService: AdminAdmissionsService,
    private errorUtils: ErrorUtilsService
  ) {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.maxLength(1000)]],
      slug: ['', [Validators.maxLength(120)]],
      deadline: ['', Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadForms();
    this.loadSubmissions();
  }

  get filteredSubmissions(): AdmissionSubmission[] {
    const search = this.searchTerm.trim().toLowerCase();
    return this.submissions.filter(submission => {
      const formOk = !this.selectedFormFilter || submission.formId === Number(this.selectedFormFilter);
      const statusOk = !this.statusFilter || submission.status === this.statusFilter;
      const text = `${submission.fullNameWithInitials} ${submission.email || ''} ${submission.whatsappNumber || ''} ${submission.cityTown || ''} ${submission.formTitle}`.toLowerCase();
      const searchOk = !search || text.includes(search);
      return formOk && statusOk && searchOk;
    });
  }

  get courseExportOptions(): string[] {
    return Array.from(new Set(
      this.submissions
        .map(submission => submission.courseApplied || submission.formTitle)
        .filter((course): course is string => !!course && course.trim().length > 0)
    )).sort((a, b) => a.localeCompare(b));
  }

  get exportSubmissionCount(): number {
    return this.exportableSubmissions.length;
  }

  loadForms(): void {
    this.loadingForms = true;
    this.admissionsService.getForms().subscribe({
      next: forms => {
        this.forms = forms || [];
        this.deadlineEdits = {};
        this.forms.forEach(form => this.deadlineEdits[form.id] = this.toDatetimeLocal(form.deadline));
        this.loadingForms = false;
      },
      error: err => {
        this.loadingForms = false;
        this.errorUtils.handleHttpError(err, { component: 'AdminAdmissions', action: 'loadForms' });
      }
    });
  }

  loadSubmissions(): void {
    this.loadingSubmissions = true;
    this.admissionsService.getSubmissions().subscribe({
      next: submissions => {
        this.submissions = submissions || [];
        this.loadingSubmissions = false;
      },
      error: err => {
        this.loadingSubmissions = false;
        this.errorUtils.handleHttpError(err, { component: 'AdminAdmissions', action: 'loadSubmissions' });
      }
    });
  }

  saveForm(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.savingForm = true;
    const payload = this.formGroup.value as AdmissionFormPayload;
    const request = this.editingFormId
      ? this.admissionsService.updateForm(this.editingFormId, payload)
      : this.admissionsService.createForm(payload);

    request.subscribe({
      next: () => {
        this.errorUtils.showSuccess(this.editingFormId ? 'Admission form updated.' : 'Admission form created.');
        this.resetForm();
        this.loadForms();
      },
      error: err => {
        this.errorUtils.handleHttpError(err, { component: 'AdminAdmissions', action: 'saveForm' });
        this.savingForm = false;
      },
      complete: () => this.savingForm = false
    });
  }

  editForm(form: AdmissionForm): void {
    this.editingFormId = form.id;
    this.formGroup.patchValue({
      title: form.title,
      description: form.description,
      slug: form.slug,
      deadline: this.toDatetimeLocal(form.deadline),
      active: form.active
    });
  }

  resetForm(): void {
    this.editingFormId = undefined;
    this.formGroup.reset({ active: true });
    this.savingForm = false;
  }

  toggleActive(form: AdmissionForm): void {
    this.admissionsService.updateActiveStatus(form.id, !form.active).subscribe({
      next: updated => {
        Object.assign(form, updated);
        this.errorUtils.showSuccess(updated.active ? 'Admission form activated.' : 'Admission form deactivated.');
      },
      error: err => this.errorUtils.handleHttpError(err, { component: 'AdminAdmissions', action: 'toggleActive' })
    });
  }

  extendDeadline(form: AdmissionForm): void {
    const deadline = this.deadlineEdits[form.id];
    if (!deadline) {
      this.errorUtils.showWarning('Please select a deadline.');
      return;
    }

    this.admissionsService.updateDeadline(form.id, deadline).subscribe({
      next: updated => {
        Object.assign(form, updated);
        this.deadlineEdits[form.id] = this.toDatetimeLocal(updated.deadline);
        this.errorUtils.showSuccess('Deadline updated.');
      },
      error: err => this.errorUtils.handleHttpError(err, { component: 'AdminAdmissions', action: 'extendDeadline' })
    });
  }

  archiveForm(form: AdmissionForm): void {
    this.admissionsService.archiveForm(form.id).subscribe({
      next: updated => {
        Object.assign(form, updated);
        this.confirmArchiveId = undefined;
        this.errorUtils.showSuccess('Admission form archived.');
      },
      error: err => this.errorUtils.handleHttpError(err, { component: 'AdminAdmissions', action: 'archiveForm' })
    });
  }

  viewSubmission(id: number): void {
    this.admissionsService.getSubmission(id).subscribe({
      next: submission => this.selectedSubmission = submission,
      error: err => this.errorUtils.handleHttpError(err, { component: 'AdminAdmissions', action: 'viewSubmission' })
    });
  }

  updateSubmissionStatus(submission: AdmissionSubmission, status: AdmissionSubmission['status']): void {
    this.admissionsService.updateSubmissionStatus(submission.id, status).subscribe({
      next: updated => {
        Object.assign(submission, updated);
        if (this.selectedSubmission?.id === updated.id) {
          this.selectedSubmission = updated;
        }
        this.errorUtils.showSuccess('Application status updated.');
      },
      error: err => this.errorUtils.handleHttpError(err, { component: 'AdminAdmissions', action: 'updateSubmissionStatus' })
    });
  }

  onSubmissionStatusChange(submission: AdmissionSubmission, status: string): void {
    this.updateSubmissionStatus(submission, status as AdmissionSubmission['status']);
  }

  exportApplications(): void {
    const submissions = this.exportableSubmissions;
    if (!submissions.length) {
      this.errorUtils.showWarning('No applications match the selected export filter.');
      return;
    }

    const columns = [
      'Reference ID',
      'Submitted At',
      'Status',
      'Form',
      'Full Name',
      'Email',
      'Age',
      'Gender',
      'Marital Status',
      'Course Applied',
      'Qualification',
      'Current Occupation',
      'Address',
      'City/Town',
      'WhatsApp',
      'Church/Assembly',
      'Evangelist/Pastor'
    ];

    const rows = submissions.map(submission => [
      submission.id,
      this.formatExportDate(submission.submittedAt),
      submission.status,
      submission.formTitle,
      submission.fullNameWithInitials,
      submission.email,
      submission.age,
      submission.gender,
      submission.maritalStatus,
      submission.courseApplied,
      submission.qualification,
      submission.currentOccupation,
      submission.fullAddress,
      submission.cityTown,
      submission.whatsappNumber,
      submission.churchAssemblyName,
      submission.evangelistPastorName
    ]);

    const table = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            table { border-collapse: collapse; }
            th, td { border: 1px solid #d9e2ef; padding: 6px 8px; mso-number-format: "\\@"; }
            th { background: #e8eef6; font-weight: 700; }
          </style>
        </head>
        <body>
          <table>
            <thead><tr>${columns.map(column => `<th>${this.escapeExcelHtml(column)}</th>`).join('')}</tr></thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(value => `<td>${this.escapeExcelHtml(value)}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>`;

    const year = new Date().getFullYear();
    const blob = new Blob([table], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    saveAs(blob, `MBC online applications ${year}.xls`);
  }

  clearExportCourseFilter(): void {
    this.selectedExportCourses = [];
  }

  statusLabel(form: AdmissionForm): string {
    if (!form.active) return 'Inactive';
    return form.open ? 'Open' : 'Closed';
  }

  private toDatetimeLocal(value: string): string {
    if (!value) return '';
    return value.slice(0, 16);
  }

  private get exportableSubmissions(): AdmissionSubmission[] {
    if (!this.selectedExportCourses.length) {
      return this.submissions;
    }
    return this.submissions.filter(submission =>
      this.selectedExportCourses.includes(submission.courseApplied || submission.formTitle)
    );
  }

  private formatExportDate(value: string): string {
    return value ? new Date(value).toLocaleString() : '';
  }

  private escapeExcelHtml(value: unknown): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
