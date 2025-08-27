import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-login',
  templateUrl: './role-login.component.html',
  styleUrls: ['./role-login.component.scss']
})
export class RoleLoginComponent implements OnInit {
  role!: string;
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get role from URL
    this.role = this.route.snapshot.paramMap.get('role') || '';
    
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    // 🔹 Dummy validation (replace with real backend API)
    if (username === 'test' && password === '1234') {
      // Navigate to role dashboard
      this.router.navigate([`/${this.role}`]);
    } else {
      this.errorMessage = 'Invalid credentials. Please try again.';
    }
  }
}
