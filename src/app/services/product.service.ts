import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  base_url = environment.base_url;

  constructor(private http: HttpClient) {}

  obtenerProductos() {
    return this.http.get<{ok: boolean, products: Product[] }>(`${this.base_url}/product/all-products`);
  }

  obtenerRecienteAntiguo(){
    return this.http.get<{ok: boolean, products: Product[]}>(`${this.base_url}/product/recent-to-old`);
  }

  obtenerAntiguoReciente(){
    return this.http.get<{ok: boolean, products: Product[]}>(`${this.base_url}/product/old-to-recent`);
  }

  crearProducto(product: Product) {
    return this.http.post(`${this.base_url}/product/create-with-discount`, product);
  }

}
