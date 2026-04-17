import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../dashboard/navbar.component';
import { QuantityService } from '../quantity.service';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';

// History endpoints (getHistory, getByOperation, getByType, getCount)
// are ADMIN-only on the backend — regular USERs get 403 Forbidden.

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  history: any[] = [];
  loading  = false;
  error    = '';

  filterOp   = '';
  filterType = '';
  isAdmin    = false;

  constructor(
    private svc: QuantityService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.error   = '';
    this.filterOp   = '';
    this.filterType = '';
    
    this.svc.getHistory().subscribe({
      next: (res) => {
        this.history = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Load History Error:', e);
        if (e.status === 401 || e.error?.status === 401) {
          this.error = 'Your session has expired. Please login again.';
        } else {
          this.error = e.error?.errorMessage || e.message || 'Failed to load history.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByOperation() {
    if (!this.filterOp) { this.loadHistory(); return; }
    this.loading = true;
    this.error   = '';
    
    this.svc.getByOperation(this.filterOp).subscribe({
      next: (res) => {
        this.history = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Filter Operation Error:', e);
        this.error = e.error?.errorMessage || e.message || 'Filter failed.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByType() {
    if (!this.filterType) { this.loadHistory(); return; }
    this.loading = true;
    this.error   = '';
    
    this.svc.getByType(this.filterType).subscribe({
      next: (res) => {
        this.history = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Filter Type Error:', e);
        this.error = e.error?.errorMessage || e.message || 'Filter failed.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(ts: string): string {
    if (!ts) return '-';
    return new Date(ts).toLocaleString();
  }
}