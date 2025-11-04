import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message: string = '';
  loading = false;
  apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    this.http.post(`${this.apiUrl}/forgot-password`, this.form.value, { responseType: 'text' })
  .subscribe({
    next: (res: string) => {
      this.message = res; // show server message
      this.loading = false;
    },
    error: (err) => {
      this.message = err.error; // backend sends text in badRequest
      this.loading = false;
    }
  });

  }
}
