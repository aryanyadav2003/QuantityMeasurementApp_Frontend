import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// This guard only protects routes that need login (like history).
// If user is not logged in, they are redirected to login page.
export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // Redirect to login page if not authenticated
  router.navigate(['/auth/login']);
  return false;
};