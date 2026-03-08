import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/products';
import { CartService } from '../../../core/services/cart';
import { AuthService } from '../../../core/services/auth'; // <--- IMPORTANTE: Importa el AuthService
import { Product } from '../../../core/models/product.model';


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  // Inyecciones de servicios
  private productService = inject(ProductService);
  public authService = inject(AuthService);
  private cartService = inject(CartService);

  productos: Product[] = [];

  ngOnInit() {
    this.uploadProductos();
  }

  uploadProductos() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

      addToCart(product: Product) {
        this.cartService.addToCart(product);
        console.log('Producto agregado al carrito:', product);
      }

  
}