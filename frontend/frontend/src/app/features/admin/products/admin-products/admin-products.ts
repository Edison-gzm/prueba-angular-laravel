import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/products';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html'
})
export class AdminProductsComponent {

  products:any[] = [];
  allProducts:any[] = [];

  searchTerm:string = "";

  creatingProduct = false;
  editingProduct = false;

  newProduct:any = {
    name:"",
    description:"",
    price:0,
    stock:0
  };

  editData:any = {
    id:null,
    name:"",
    description:"",
    price:0,
    stock:0
  };

  constructor(private productService:ProductService){}

  ngOnInit(){
    this.loadProducts();
  }

  // CARGAR PRODUCTOS
  loadProducts(){

    this.productService.getProducts()
    .subscribe((data:any)=>{

      this.products = data;
      this.allProducts = data;

    });

  }

  // BUSCAR PRODUCTO
  searchProduct(){

    const term = this.searchTerm.toLowerCase().trim();

    if(term === ""){
      this.products = this.allProducts;
      return;
    }

    this.products = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(term)
    );

  }

  // MOSTRAR FORMULARIO CREAR
  showCreateForm(){
    this.creatingProduct = true;
  }

  // CREAR PRODUCTO
  createProduct(){

    this.productService.createProduct(this.newProduct)
    .subscribe({

      next:()=>{

        alert("Producto creado");

        this.creatingProduct = false;

        this.newProduct = {
          name:"",
          Category:"",
          price:0,
          stock:0
        };

        this.loadProducts();

      },

      error:(err:any)=>{
        console.error(err);
      }

    });

  }

  // EDITAR PRODUCTO
  editProduct(product:any){

    this.editingProduct = true;

    this.editData = {
      id:product.id,
      name:product.name,
      Category:product.Category,
      price:product.price,
      stock:product.stock
    };

  }

  // ACTUALIZAR PRODUCTO
        updateProduct(){

          this.productService.updateProduct(this.editData.id,this.editData)
          .subscribe({

          next:()=>{
          alert("Producto actualizado");
          this.loadProducts();
          this.editingProduct = false;
          },

          error:(err:any)=>{
          console.error(err);
          }

          });

        }

  // ELIMINAR (ya lo tienes)
  deleteProduct(id:number){

    if(confirm("¿Eliminar producto?")){

      this.productService.deleteProduct(id)
      .subscribe(()=>{

        this.loadProducts();

      });

    }

  }

}