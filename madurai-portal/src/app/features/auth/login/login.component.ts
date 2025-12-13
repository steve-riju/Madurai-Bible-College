import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../../shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loginForm.valueChanges.subscribe(() => {
  this.errorMessage = '';
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

  goToForgotPassword() {
    this.showLoginForm = false; // optional fade-out
    setTimeout(() => {
      this.router.navigate(['/auth/forgot-password']);
    }, 400);
  }

  private showError(message: string, timeout = 3000) {
  this.errorMessage = message;

  setTimeout(() => {
    this.errorMessage = '';
  }, timeout);
}


  onSubmit() {
  if (this.loginForm.invalid) {
    this.showError('Please fill in all fields.');
    return;
  }

  this.loading = true;

    const { username, password } = this.loginForm.value;

    this.authService.login(username.trim(), password).subscribe({
      next: () => {
        this.loading = false;
        // redirect handled in service
      },
     error: () => {
      this.loading = false;
      this.showError('Invalid credentials. Please try again.');
    }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
       if (params['sessionExpired']) {
      this.showError('Your session has expired. Please log in again.', 9000);
    }
    });
  }
}
