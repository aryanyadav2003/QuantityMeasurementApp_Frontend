import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../auth/auth.service';
import { QuantityService } from '../operations/quantity.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Subscribe to current user (null = not logged in)
  currentUser$ = this.auth.currentUser$;

  // Count of measurements — only loaded for ADMIN users
  measurementCount: number | null = null;

  // Whether the logged-in user is an admin
  isAdmin = false;

  // Operation cards shown on the dashboard
  operations = [
    {
      label:       'Compare',
      route:       '/operations/compare',
      icon:        '⚖️',
      description: 'Compare two quantities (e.g. 2 feet vs 24 inches)',
      needsLogin:  false
    },
    {
      label:       'Convert',
      route:       '/operations/convert',
      icon:        '🔄',
      description: 'Convert a value from one unit to another',
      needsLogin:  false
    },
    {
      label:       'Arithmetic',
      route:       '/operations/arithmetic',
      icon:        '➕',
      description: 'Add, subtract or divide two quantities',
      needsLogin:  false
    },
    {
      label:       'History',
      route:       '/operations/history',
      icon:        '📋',
      description: 'View all past operations',
      needsLogin:  true
    }
  ];

  constructor(private auth: AuthService, private svc: QuantityService) {}

  async ngOnInit() {
    this.isAdmin = this.auth.isAdmin();

    // Fetch count if the user is logged in
    this.currentUser$.subscribe(user => {
      if (user) {
        this.svc.getCount().subscribe({
          next: (res) => {
            this.measurementCount = res?.totalCount ?? res;
          },
          error: () => {
             this.measurementCount = null;
          }
        });
      }
    });
  }
}