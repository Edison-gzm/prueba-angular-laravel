import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/products'; // Tu ruta de Laravel

  getProducts() {

    // Obtener token guardado en login
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Ahora usamos Product[]
    return this.http.get<Product[]>(this.apiUrl, { headers });

  }


      buyProducts(items: { product_id: number; quantity: number }[]) {

          const token = localStorage.getItem('token');

          const headers = {
            Authorization: `Bearer ${token}`
            };

          return this.http.post(
            'http://localhost:8000/api/products/buy',
            { items },
            { headers }
         );
      }
}