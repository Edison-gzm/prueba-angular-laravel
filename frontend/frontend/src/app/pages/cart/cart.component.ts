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

checkout() {

  const items = this.cartService.items();

  const payload = items.map(item => ({
    product_id: item.id,
    quantity: item.quantity
  }));

  this.productService.buyProducts(payload)
    .subscribe({
      next: () => {

        this.cartService.clearCart();

        alert("Compra realizada ✅");

      },
      error: err => console.error(err)
    });

}
}