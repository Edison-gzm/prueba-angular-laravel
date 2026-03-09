import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/products';
import { CartService } from '../../../core/services/cart';
import { AuthService } from '../../../core/services/auth';
import { Product } from '../../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { ObserveVisibleDirective } from '../../../shared/observe-visible/observe-visible.directive';

const PRODUCTS_PER_PAGE = 3;

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink, ObserveVisibleDirective],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {

  private productService = inject(ProductService);
  public authService = inject(AuthService);
  private cartService = inject(CartService);

  productos: Product[] = [];
  loading = false;
  loadingMore = false;
  errorMessage = '';
  currentPage = 0;
  lastPage = 1;
  hasMore = false;

  ngOnInit() {
    this.loadFirstPage();
  }

  loadFirstPage() {
    this.loading = true;
    this.errorMessage = '';
    this.productos = [];
    this.currentPage = 0;
    this.lastPage = 1;
    this.hasMore = false;

    this.productService.getProductsPaginated(1, PRODUCTS_PER_PAGE).subscribe({
      next: (res) => {
        this.productos = res.data;
        this.currentPage = res.current_page;
        this.lastPage = res.last_page;
        this.hasMore = res.current_page < res.last_page;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.errorMessage = 'Ocurrió un error al cargar los productos.';
        this.loading = false;
      }
    });
  }

  loadMore() {
    if (this.loadingMore || !this.hasMore) return;
    this.loadingMore = true;
    const nextPage = this.currentPage + 1;

    this.productService.getProductsPaginated(nextPage, PRODUCTS_PER_PAGE).subscribe({
      next: (res) => {
        this.productos = [...this.productos, ...res.data];
        this.currentPage = res.current_page;
        this.lastPage = res.last_page;
        this.hasMore = res.current_page < res.last_page;
        this.loadingMore = false;
      },
      error: (err) => {
        console.error('Error al cargar más productos', err);
        this.loadingMore = false;
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  deleteProduct(id: number) {
    if (confirm('¿Eliminar producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadFirstPage(),
        error: (err) => console.error(err)
      });
    }
  }

  editProduct(product: Product) {
    console.log('Editar producto:', product);
  }
}