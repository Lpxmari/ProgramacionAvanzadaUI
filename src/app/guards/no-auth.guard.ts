import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);
  console.log(!authService.hasToken());
  if (!authService.hasToken()) return true;
  return router.createUrlTree(['/home']);
};