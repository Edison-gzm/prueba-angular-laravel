import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient); // Forma moderna
  private apiUrl = 'http://localhost:8000/api/auth'; 

login(data: any) {
  return this.http.post(`${this.apiUrl}/login`, data).pipe(
    tap((response: any) => {
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Guardamos el rol
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

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
  }
}