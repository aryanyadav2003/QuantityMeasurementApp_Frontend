import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser$ = this.auth.currentUser$;

  // FIX: Emit events so dashboard can open the auth panel as a modal
  @Output() onLoginClick = new EventEmitter<void>();
  @Output() onRegisterClick = new EventEmitter<void>();

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    // Stay on dashboard after logout — no redirect to login page
    this.router.navigate(['/dashboard']);
  }

  loginClicked() {
    this.onLoginClick.emit();
  }

  registerClicked() {
    this.onRegisterClick.emit();
  }
}