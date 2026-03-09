import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Guard que restringe el acceso a rutas de administración solo a usuarios con rol admin.
 * Si el usuario no está logueado, redirige a /auth.
 * Si está logueado pero no es admin, redirige a /user.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth']);
    return false;
  }

  if (!authService.isAdmin()) {
    router.navigate(['/user']);
    return false;
  }

  return true;
};
