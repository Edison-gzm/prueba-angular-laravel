import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart';
import { ProductService } from '../../core/services/products';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartService = inject(CartService);
  productService = inject(ProductService);

  cartItems = this.cartService.items;

checkout()  {
  const itemsToBuy = this.cartService.items().map(item => ({
    product_id: item.id,
    quantity: item.quantity
  }));

  this.productService.buyProducts(itemsToBuy).subscribe({
    next: (res) => {
      alert('Compra realizada con éxito');
      this.cartService.clearCart();
     window.location.reload();

    },
    error: (err) => {
      console.error('Error al comprar', err);
    }
  });
}
}