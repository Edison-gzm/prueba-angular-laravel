import { Data } from "@angular/router";

export interface Product {
  id: number;
  name: string;
 Category: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
  image?: string;
}