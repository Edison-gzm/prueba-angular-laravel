import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

/** Niveles de fortaleza: muy poco segura → muy segura */
export interface PasswordStrength {
  level: number;       // 0-5 criterios cumplidos
  percent: number;     // 0-100
  label: string;
  barColor: string;    // clase Tailwind para la barra
  textColor: string;   // clase Tailwind para el texto
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  name = '';
  email = '';
  password = '';

  /** Estado de carga al enviar (spinner "Creando...") */
  registerLoading = false;

  /** Mensaje de error al registrar (contraseña u otros). Se muestra en el template. */
  registerError: string[] | null = null;

  /** Lista de requisitos que le faltan a la contraseña actual (en español). */
  get passwordMissingRequirements(): string[] {
    const p = this.password;
    const list: string[] = [];
    if (p.length < 8) list.push('Mínimo 8 caracteres.');
    if (!/[A-Z]/.test(p)) list.push('Al menos una letra mayúscula.');
    if (!/[a-z]/.test(p)) list.push('Al menos una letra minúscula.');
    if (!/[0-9]/.test(p)) list.push('Al menos un número.');
    if (!/[^A-Za-z0-9]/.test(p)) list.push('Al menos un carácter especial (ej. @, #, !).');
    return list;
  }

  /** Requisitos: 8+ caracteres, mayúscula, minúscula, número, carácter especial */
  get passwordStrength(): PasswordStrength {
    const p = this.password;
    if (!p.length) {
      return { level: 0, percent: 0, label: '', barColor: '', textColor: '' };
    }
    const hasMinLength = p.length >= 8;
    const hasUpper = /[A-Z]/.test(p);
    const hasLower = /[a-z]/.test(p);
    const hasNumber = /[0-9]/.test(p);
    const hasSpecial = /[^A-Za-z0-9]/.test(p);
    const level = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    const percent = (level / 5) * 100;

    const configs: Record<number, { label: string; barColor: string; textColor: string }> = {
      0: { label: 'Muy poco segura', barColor: 'bg-red-500', textColor: 'text-red-600' },
      1: { label: 'Muy poco segura', barColor: 'bg-red-500', textColor: 'text-red-600' },
      2: { label: 'Poco segura', barColor: 'bg-orange-500', textColor: 'text-orange-600' },
      3: { label: 'Segura', barColor: 'bg-yellow-500', textColor: 'text-yellow-600' },
      4: { label: 'Bastante segura', barColor: 'bg-lime-500', textColor: 'text-lime-600' },
      5: { label: 'Muy segura', barColor: 'bg-green-500', textColor: 'text-green-600' }
    };
    const c = configs[level] ?? configs[0];
    return { level, percent, label: c.label, barColor: c.barColor, textColor: c.textColor };
  }

  register() {
    this.registerError = null;

    const body = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    // Validar contraseña en cliente: si no cumple todo, no enviar y mostrar qué falta
    if (this.passwordStrength.level < 5) {
      this.registerError = [
        'Tu contraseña no cumple los requisitos mínimos de seguridad.',
        ...this.passwordMissingRequirements
      ];
      this.cdr.markForCheck();
      return;
    }

    this.registerLoading = true;
    this.cdr.markForCheck();

    this.http.post('http://localhost:8000/api/auth/register', body).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.http.post<{ token: string }>('http://localhost:8000/api/auth/login', {
          email: this.email,
          password: this.password
        }).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/user']);
          },
          error: () => {
            this.registerLoading = false;
            this.registerError = ['Error al iniciar sesión. Intenta entrar manualmente.'];
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        this.registerLoading = false;
        const status = err.status;
        const bodyErr = err.error as { message?: string; errors?: Record<string, string[]> } | null;

        if (status === 422 && bodyErr?.errors) {
          const msgs: string[] = [];
          if (bodyErr.errors['password']?.length) {
            msgs.push('Tu contraseña no cumple los requisitos mínimos de seguridad.');
            msgs.push(...bodyErr.errors['password']);
          }
          if (bodyErr.errors['email']?.length) {
            msgs.push(...bodyErr.errors['email']);
          }
          if (bodyErr.errors['name']?.length) {
            msgs.push(...bodyErr.errors['name']);
          }
          this.registerError = msgs.length ? msgs : ['Datos inválidos. Revisa el formulario.'];
        } else {
          this.registerError = [
            bodyErr?.message || 'No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo.'
          ];
        }
        this.cdr.markForCheck();
      }
    });
  }

}