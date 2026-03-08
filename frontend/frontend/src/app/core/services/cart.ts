import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private cartItems = signal<CartItem[]>([]);

  items = this.cartItems.asReadonly();

  count = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  total = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  addToCart(product: Product) {

    const items = this.cartItems();

    const existing = items.find(p => p.id === product.id);

    if (existing) {

      existing.quantity++;

      this.cartItems.set([...items]);

    } else {

      this.cartItems.update(items => [
        ...items,
        { ...product, quantity: 1 }
      ]);

    }

  }

  increase(id: number) {

    const items = this.cartItems();

    const product = items.find(p => p.id === id);

    if (product) product.quantity++;

    this.cartItems.set([...items]);
  }

  decrease(id: number) {

    const items = this.cartItems();

    const product = items.find(p => p.id === id);

    if (!product) return;

    product.quantity--;

    if (product.quantity <= 0) {
      this.remove(id);
    } else {
      this.cartItems.set([...items]);
    }

  }

  remove(id: number) {

    this.cartItems.update(items =>
      items.filter(p => p.id !== id)
    );

  }

  clearCart() {
    this.cartItems.set([]);
  }

}