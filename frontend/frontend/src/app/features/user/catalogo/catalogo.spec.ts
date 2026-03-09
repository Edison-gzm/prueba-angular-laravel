import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { CatalogoComponent } from './catalogo.component';
import { ProductService } from '../../../core/services/products';
import { CartService } from '../../../core/services/cart';
import { AuthService } from '../../../core/services/auth';
import { Product } from '../../../core/models/product.model';

describe('CatalogoComponent', () => {
  let component: CatalogoComponent;
  let fixture: ComponentFixture<CatalogoComponent>;
  let httpMock: HttpTestingController;
  let cartService: CartService;

  const paginatedResponse = {
    data: [{ id: 1, name: 'P1', Category: 'C', price: 10, stock: 5, created_at: new Date(), updated_at: new Date() }] as Product[],
    current_page: 1,
    last_page: 2,
    per_page: 3,
    total: 4,
  };

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CatalogoComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
    const initReq = httpMock.match((r) => r.url.includes('/api/products'));
    if (initReq.length) initReq[0].flush(paginatedResponse);
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load first page on init', () => {
    // Initial GET was already flushed in beforeEach with paginatedResponse
    expect(component.productos.length).toBe(1);
    expect(component.productos[0].name).toBe('P1');
    expect(component.currentPage).toBe(1);
    expect(component.lastPage).toBe(2);
    expect(component.hasMore).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('loadMore should append next page', () => {
    // Initial request was already flushed in beforeEach; component has page 1 and hasMore=true
    component.loadMore();
    const req2 = httpMock.expectOne((r) => r.url.includes('/api/products') && r.params.get('page') === '2');
    req2.flush({
      data: [{ id: 2, name: 'P2', Category: 'C', price: 5, stock: 1, created_at: new Date(), updated_at: new Date() }] as Product[],
      current_page: 2,
      last_page: 2,
      per_page: 3,
      total: 4,
    });

    expect(component.productos.length).toBe(2);
    expect(component.currentPage).toBe(2);
    expect(component.hasMore).toBe(false);
  });

  it('addToCart should call CartService.addToCart', () => {
    // Initial request was already flushed in beforeEach; component.productos already has data
    const product = component.productos[0];
    vi.spyOn(cartService, 'addToCart');
    component.addToCart(product);
    expect(cartService.addToCart).toHaveBeenCalledWith(product);
  });

  it('should set errorMessage on load error', () => {
    // Trigger a new load (clears state and sends new request), then flush with error
    component.loadFirstPage();
    const req = httpMock.expectOne((r) => r.url.includes('/api/products'));
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(component.errorMessage).toBe('Ocurrió un error al cargar los productos.');
    expect(component.loading).toBe(false);
  });
});
