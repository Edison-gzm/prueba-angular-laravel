import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/products';
import { CartService } from '../../../core/services/cart';
import { AuthService } from '../../../core/services/auth';
import { Product } from '../../../core/models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {

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

      deleteProduct(id: number) {

  if(confirm('¿Eliminar producto?')){

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.uploadProductos(); // recargar catálogo
      },
      error: (err) => console.error(err)
    });

  }

}

editProduct(product: Product) {
  console.log("Editar producto:", product);
}

  
}