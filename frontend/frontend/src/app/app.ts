import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './core/services/cart'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Inyectamos el servicio del carrito para usar sus Signals
  private cartService = inject(CartService);
  
  // Exponemos el contador reactivo al HTML
  public cartCount = this.cartService.count;

    logout() {
     localStorage.removeItem('token');
      window.location.href = '/';
    } 

      isLoggedIn() {
      return !!localStorage.getItem('token');
    }

}
