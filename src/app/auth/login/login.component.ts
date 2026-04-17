import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// FIX: Make sure this import path exactly matches the file location.
// AuthService is at: src/app/auth/auth.service.ts
// This component is at: src/app/auth/login/login.component.ts
// So the import path is '../auth.service' (one level up)
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email    = '';
  password = '';
  loading  = false;
  error    = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';

    // Basic validation
    if (!this.email)    { this.error = 'Email is required';    return; }
    if (!this.password) { this.error = 'Password is required'; return; }

    this.loading = true;

    // Call AuthService.login() which calls the backend
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // On success, go to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        // Show error message from backend, or a generic one
        this.error   = e.error?.message || 'Login failed. Check email and password.';
        this.loading = false;
      }
    });
  }
}