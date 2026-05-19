import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const payload = authService.getPayload();

  // Si no hay token o payload
  if (!payload) {
    return router.createUrlTree(['/login']);
  }

  // Rol requerido en la ruta
  const requiredRole = route.data?.['role'];

  // Rol del token
  const userRole = payload.rol;

  console.log('Role Guard - Required:', requiredRole, 'User Role:', userRole);

  // Validar rol
  if (requiredRole && userRole !== requiredRole) {
    return router.createUrlTree(['/home']);
  }

  return true;
};