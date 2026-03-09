import { TestBed } from '@angular/core/testing';
import { CartService } from './cart';
import { Product } from '../models/product.model';

const mockProduct: Product = {
  id: 1,
  name: 'Test',
  Category: 'Cat',
  price: 10,
  stock: 5,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty cart', () => {
    expect(service.items().length).toBe(0);
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  describe('addToCart', () => {
    it('should add a new product with quantity 1', () => {
      service.addToCart(mockProduct);
      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(1);
      expect(service.count()).toBe(1);
      expect(service.total()).toBe(10);
    });

    it('should increase quantity when adding same product again', () => {
      service.addToCart(mockProduct);
      service.addToCart(mockProduct);
      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(2);
      expect(service.count()).toBe(2);
      expect(service.total()).toBe(20);
    });
  });

  describe('increase', () => {
    it('should increase quantity of item by id', () => {
      service.addToCart(mockProduct);
      service.increase(1);
      expect(service.items()[0].quantity).toBe(2);
      expect(service.total()).toBe(20);
    });
  });

  describe('decrease', () => {
    it('should decrease quantity and keep item when quantity > 1', () => {
      service.addToCart(mockProduct);
      service.addToCart(mockProduct);
      service.decrease(1);
      expect(service.items()[0].quantity).toBe(1);
      expect(service.total()).toBe(10);
    });

    it('should remove item when quantity becomes 0', () => {
      service.addToCart(mockProduct);
      service.decrease(1);
      expect(service.items().length).toBe(0);
      expect(service.count()).toBe(0);
      expect(service.total()).toBe(0);
    });
  });

  describe('remove', () => {
    it('should remove item by id', () => {
      service.addToCart(mockProduct);
      service.remove(1);
      expect(service.items().length).toBe(0);
      expect(service.count()).toBe(0);
      expect(service.total()).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should empty the cart', () => {
      service.addToCart(mockProduct);
      service.clearCart();
      expect(service.items().length).toBe(0);
      expect(service.count()).toBe(0);
      expect(service.total()).toBe(0);
    });
  });

  describe('computed total', () => {
    it('should sum price * quantity for all items', () => {
      const p2 = { ...mockProduct, id: 2, price: 5 };
      service.addToCart(mockProduct);
      service.addToCart(mockProduct);
      service.addToCart(p2);
      expect(service.total()).toBe(10 * 2 + 5 * 1);
    });
  });
});
