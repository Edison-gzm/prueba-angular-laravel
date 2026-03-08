import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Simulación de sesión 

  if (token) {
    return true; 
  } else {
    router.navigate(['/auth']); // Redirige al login si no hay sesión
    return false;
  }
};