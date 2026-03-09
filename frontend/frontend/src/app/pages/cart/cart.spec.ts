import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { CartComponent } from './cart.component';
import { CartService } from '../../core/services/cart';
import { ProductService } from '../../core/services/products';
import { Product } from '../../core/models/product.model';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let httpMock: HttpTestingController;
  let cartService: CartService;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CartComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checkout should POST buy and clear cart on success', () => {
    const product: Product = {
      id: 1,
      name: 'P',
      Category: 'C',
      price: 10,
      stock: 5,
      created_at: new Date(),
      updated_at: new Date(),
    };
    cartService.addToCart(product);
    cartService.addToCart(product);

    vi.spyOn(window, 'alert');
    component.checkout();

    const req = httpMock.expectOne('http://localhost:8000/api/products/buy');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.items).toEqual([{ product_id: 1, quantity: 2 }]);
    req.flush({});

    expect(cartService.items().length).toBe(0);
    expect(component.checkoutLoading).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Compra realizada con éxito');
  });

  it('checkout should set checkoutLoading to false on error', () => {
    cartService.addToCart({
      id: 1,
      name: 'P',
      Category: 'C',
      price: 10,
      stock: 5,
      created_at: new Date(),
      updated_at: new Date(),
    });
    component.checkout();

    const req = httpMock.expectOne('http://localhost:8000/api/products/buy');
    req.flush('Error', { status: 400, statusText: 'Bad Request' });

    expect(component.checkoutLoading).toBe(false);
  });
});
