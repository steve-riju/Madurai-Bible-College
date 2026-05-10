import { Component, OnInit } from '@angular/core';
import { AdmissionForm } from '../../../shared/models/admission.model';
import { PublicAdmissionsService } from '../services/public-admissions.service';

@Component({
  selector: 'app-admission-landing',
  templateUrl: './admission-landing.component.html',
  styleUrls: ['./admission-landing.component.scss']
})
export class AdmissionLandingComponent implements OnInit {
  forms: AdmissionForm[] = [];
  loading = false;
  error = '';

  constructor(private admissionsService: PublicAdmissionsService) {}

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms(): void {
    this.loading = true;
    this.error = '';
    this.admissionsService.getForms().subscribe({
      next: forms => {
        this.forms = forms || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load admission forms. Please try again later.';
        this.loading = false;
      }
    });
  }
}
