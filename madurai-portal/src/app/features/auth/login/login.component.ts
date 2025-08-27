import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(-50px)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  selectedRole: string | null = null;
  showLoginForm: boolean = false;
  loginForm!: FormGroup;
  errorMessage: string = '';
  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
    setTimeout(() => {
      this.showLoginForm = true;
    }, 400);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  goBack() {
    this.showLoginForm = false;
    setTimeout(() => {
      this.selectedRole = null;
      this.loginForm.reset();
      this.errorMessage = '';
    }, 400);
  }

  onSubmit() {
    if (this.loginForm.invalid || !this.selectedRole) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const { username, password } = this.loginForm.value;

    // 🔹 Dummy role-based login check
    if (username === this.selectedRole && password === '1234') {
      this.authService.login(this.selectedRole as 'student' | 'teacher' | 'admin');
    } else {
      this.errorMessage = 'Invalid credentials. Please try again.';
    }
  }
}
