import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

/** Respuesta paginada del API (scroll infinito). */
export interface ProductsPaginatedResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8000/api/products';

  /** Lista todos (sin paginación). Usado por admin. */
  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /** Lista una página (para catálogo con scroll infinito). */
  getProductsPaginated(page: number, perPage: number) {
    return this.http.get<ProductsPaginatedResponse>(this.apiUrl, {
      params: { page, per_page: perPage }
    });
  }

  // OBTENER UN PRODUCTO
  getProduct(id:number){
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // CREAR PRODUCTO
  createProduct(data:any){
    return this.http.post(`${this.apiUrl}`, data);
  }

  // ACTUALIZAR PRODUCTO
  updateProduct(id:number,data:any){
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // ELIMINAR PRODUCTO
  deleteProduct(id:number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // COMPRAR PRODUCTOS
  buyProducts(items:{ product_id:number; quantity:number }[]){
    return this.http.post(`${this.apiUrl}/buy`, { items });
  }

}