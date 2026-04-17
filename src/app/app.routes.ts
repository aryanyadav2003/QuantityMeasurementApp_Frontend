import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

// All operation routes now require login because the backend has
// [Authorize] on the entire QuantityMeasurementController class.
// Only dashboard, login, and register are publicly accessible.

export const routes: Routes = [
  // Default route goes straight to dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard — accessible to everyone (no authGuard)
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // Login page — accessible to everyone
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },

  // Register page — accessible to everyone
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Operations — ALL require login because backend [Authorize] is on the whole controller
  {
    path: 'operations/compare',
    loadComponent: () =>
      import('./operations/compare/compare.component').then(m => m.CompareComponent)
  },
  {
    path: 'operations/convert',
    loadComponent: () =>
      import('./operations/convert/convert.component').then(m => m.ConvertComponent)
  },
  {
    path: 'operations/arithmetic',
    loadComponent: () =>
      import('./operations/arithmetic/arithmetic.component').then(m => m.ArithmeticComponent)
  },

  // History — ADMIN only (enforced in history.component.ts)
  {
    path: 'operations/history',
    loadComponent: () =>
      import('./operations/history/history.component').then(m => m.HistoryComponent),
    canActivate: [authGuard]
  },

  // Fallback goes to dashboard
  { path: '**', redirectTo: 'dashboard' }
];