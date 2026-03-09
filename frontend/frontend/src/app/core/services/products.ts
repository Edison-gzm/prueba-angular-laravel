import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8000/api/products';

  // OBTENER PRODUCTOS
  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
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