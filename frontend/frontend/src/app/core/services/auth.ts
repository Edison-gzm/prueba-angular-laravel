import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/auth';

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data, { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response.token) {
          // Seguimos usando localStorage para el interceptor,
          // pero el token también viaja en una cookie HttpOnly.
          localStorage.setItem('token', response.token);
          localStorage.setItem('user_role', response.user.role);
        }
      })
    );
  }

  // Función rápida para saber si es Admin
  isAdmin(): boolean {
    return localStorage.getItem('user_role') === 'admin';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** Limpia token y rol en el cliente (llamar al cerrar sesión o si el backend falla). */
  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.clearSession())
    );
  }
}