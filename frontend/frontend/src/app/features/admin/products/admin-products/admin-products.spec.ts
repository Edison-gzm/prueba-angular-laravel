import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { AdminProductsComponent } from './admin-products';
import { ProductService } from '../../../../core/services/products';

describe('AdminProductsComponent', () => {
  let component: AdminProductsComponent;
  let fixture: ComponentFixture<AdminProductsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AdminProductsComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    const initReq = httpMock.match('http://localhost:8000/api/products');
    if (initReq.length) initReq[0].flush([]);
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    // Initial GET was already flushed in beforeEach with []
    expect(component.products).toEqual([]);
    expect(component.allProducts).toEqual([]);
    expect(component.loading).toBe(false);
  });

  it('searchProduct should filter by name', () => {
    component.allProducts = [
      { id: 1, name: 'Laptop' },
      { id: 2, name: 'Mouse' },
    ];
    component.products = component.allProducts;
    component.searchTerm = 'lap';
    component.searchProduct();
    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('Laptop');
  });

  it('searchProduct should show all when term is empty', () => {
    component.allProducts = [{ id: 1, name: 'P' }];
    component.products = [];
    component.searchTerm = '';
    component.searchProduct();
    expect(component.products).toEqual(component.allProducts);
  });

  it('showCreateForm should set creatingProduct to true', () => {
    component.showCreateForm();
    expect(component.creatingProduct).toBe(true);
  });

  it('createProduct should POST and reload products', () => {
    vi.spyOn(window, 'alert');
    component.newProduct = { name: 'N', description: 'D', price: 1, stock: 2 };
    component.creatingProduct = true;
    component.createProduct();

    const createReq = httpMock.expectOne('http://localhost:8000/api/products');
    expect(createReq.request.method).toBe('POST');
    createReq.flush({});

    const listReq = httpMock.expectOne('http://localhost:8000/api/products');
    listReq.flush([]);

    expect(component.creatingProduct).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Producto creado');
  });

  it('editProduct should set editData', () => {
    const product = { id: 2, name: 'P', Category: 'C', price: 5, stock: 1 };
    component.editProduct(product);
    expect(component.editingProduct).toBe(true);
    expect(component.editData.id).toBe(2);
    expect(component.editData.name).toBe('P');
  });

  it('updateProduct should PUT and reload', () => {
    vi.spyOn(window, 'alert');
    component.editData = { id: 3, name: 'P3', Category: 'C', price: 8, stock: 2 };
    component.editingProduct = true;
    component.updateProduct();

    const updateReq = httpMock.expectOne('http://localhost:8000/api/products/3');
    expect(updateReq.request.method).toBe('PUT');
    updateReq.flush({});

    const listReq = httpMock.expectOne('http://localhost:8000/api/products');
    listReq.flush([]);

    expect(component.editingProduct).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Producto actualizado');
  });

  it('deleteProduct should DELETE and reload when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteProduct(5);

    const delReq = httpMock.expectOne('http://localhost:8000/api/products/5');
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush(null);

    const listReq = httpMock.expectOne('http://localhost:8000/api/products');
    listReq.flush([]);
  });

  it('deleteProduct should not call API when confirm is false', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.deleteProduct(5);
    httpMock.expectNone('http://localhost:8000/api/products/5');
  });
});
