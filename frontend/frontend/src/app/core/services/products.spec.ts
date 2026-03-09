import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './products';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8000/api/products';

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should GET products list', () => {
      const mock: Product[] = [{ id: 1, name: 'P1', Category: 'C', price: 1, stock: 1, created_at: new Date(), updated_at: new Date() }];
      service.getProducts().subscribe((data) => expect(data).toEqual(mock));
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getProductsPaginated', () => {
    it('should GET with page and per_page params', () => {
      const mock = { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
      service.getProductsPaginated(1, 10).subscribe((data) => expect(data).toEqual(mock));
      const req = httpMock.expectOne(`${apiUrl}?page=1&per_page=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getProduct', () => {
    it('should GET single product by id', () => {
      const mock: Product = { id: 1, name: 'P1', Category: 'C', price: 1, stock: 1, created_at: new Date(), updated_at: new Date() };
      service.getProduct(1).subscribe((data) => expect(data).toEqual(mock));
      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('createProduct', () => {
    it('should POST new product', () => {
      const body = { name: 'P', description: 'D', price: 5, stock: 2 };
      service.createProduct(body).subscribe();
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush({});
    });
  });

  describe('updateProduct', () => {
    it('should PUT product by id', () => {
      const body = { name: 'P2', price: 10 };
      service.updateProduct(1, body).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush({});
    });
  });

  describe('deleteProduct', () => {
    it('should DELETE product by id', () => {
      service.deleteProduct(1).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('buyProducts', () => {
    it('should POST buy with items', () => {
      const items = [{ product_id: 1, quantity: 2 }];
      service.buyProducts(items).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/buy`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ items });
      req.flush({});
    });
  });
});
