import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  private http = inject(HttpClient);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';

  register() {

    const body = {
      name: this.name,
      email: this.email,
      password: this.password
    };

  this.http.post('http://localhost:8000/api/auth/register', body)
    .subscribe({
      next: () => {

        // LOGIN AUTOMÁTICO
        this.http.post<any>('http://localhost:8000/api/auth/login', {
          email: this.email,
          password: this.password
        }).subscribe({
          next: (res) => {

            localStorage.setItem('token', res.token);

            this.router.navigate(['/user']);

          }
        });

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}