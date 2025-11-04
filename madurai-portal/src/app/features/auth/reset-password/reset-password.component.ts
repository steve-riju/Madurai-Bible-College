import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form: FormGroup;
  message: string = '';
  loading = false;
  apiUrl = `${environment.apiUrl}/api/auth`;
  token: string | null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  ngOnInit(): void {
  this.token = this.route.snapshot.queryParamMap.get('token');

  if (this.token) {
    this.http.get(`${this.apiUrl}/reset-password/validate?token=${this.token}`)
      .subscribe({
        next: (res: any) => {
          this.message = `You are resetting password for account: ${res.username} (${res.email})`;
        },
        error: () => {
          this.message = 'Invalid or expired reset link.';
          this.loading = false;
        }
      });
  }
}


  onSubmit() {
    if (this.form.invalid || !this.token) return;
    this.loading = true;

    this.http.post(`${this.apiUrl}/reset-password`, {
  token: this.token,
  newPassword: this.form.value.newPassword
}, { responseType: 'text' })
  .subscribe({
    next: (res: string) => {
      this.message = res; // backend "Password reset successful."
      setTimeout(() => this.router.navigate(['/auth/login']), 2000);
    },
    error: (err) => {
      this.message = err.error; // backend "Invalid or expired token."
      this.loading = false;
    }
  });

  }
}
