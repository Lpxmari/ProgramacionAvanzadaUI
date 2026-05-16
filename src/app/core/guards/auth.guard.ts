import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export const authGuard: CanActivateFn = () => {
  
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasToken()) return true;
  console.log('No token found, redirecting to login');
  return router.createUrlTree(['/login']);
};