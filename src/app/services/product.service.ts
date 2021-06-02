import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../interfaces/product';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  base_url = environment.base_url;
  private products: Product[] = [];
  private products$: Subject<Product[]> = new Subject();

  constructor(private http: HttpClient) {}

  obtenerProductos() {
    this.http
      .get<Product[]>(`${this.base_url}/product`)
      .subscribe((data: any) => {
        this.products = data;
        this.products$.next(this.products);
      });
    return this.products$.asObservable();
  }

  crearProducto(product: Product) {
    this.http
      .post(`${this.base_url}/product`, product)
      .subscribe((data: any) => {
        this.products.push(data);
        this.products$.next(this.products);
      });
  }
}
