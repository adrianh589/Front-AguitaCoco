import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Product} from "../interfaces/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  base_url = environment.base_url;
  public carrito: Product[] = [];

  constructor( private http: HttpClient ) { }

  obtenerProductos(){
    return this.http.get<Product[]>( `${this.base_url}/product`);
  }

  crearProducto(product: Product){
    return this.http.post(`${this.base_url}/product`, product);
  }

}
