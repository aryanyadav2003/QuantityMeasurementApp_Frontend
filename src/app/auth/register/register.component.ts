import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// FIX: Import path '../auth.service' — one level up from this file's folder
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  fullName = '';
  email    = '';
  password = '';
  role: 'USER' | 'ADMIN' = 'USER';
  loading = false;
  error   = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';

    // Basic validation
    if (!this.fullName)              { this.error = 'Full name is required';                 return; }
    if (!this.email)                 { this.error = 'Email is required';                     return; }
    if (!this.email.includes('@'))   { this.error = 'Enter a valid email address';           return; }
    if (this.password.length < 6)   { this.error = 'Password must be at least 6 characters'; return; }

    this.loading = true;

    // Call AuthService.register() which calls the backend
    this.auth.register({
      fullName: this.fullName,
      email:    this.email,
      password: this.password,
      role:     this.role
    }).subscribe({
      next: () => {
        // On success, go to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.error   = e.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}