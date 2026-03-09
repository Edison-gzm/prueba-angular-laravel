import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './core/services/cart';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  public cartCount = this.cartService.count;

  logout() {
    const goHome = () => {
      this.authService.clearSession();
      window.location.href = '/';
    };
    this.authService.logout().subscribe({
      next: goHome,
      error: goHome,
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
