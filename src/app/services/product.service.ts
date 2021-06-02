import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

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
      .get<Product[]>(`${this.base_url}/product/all-products`)
      .subscribe((data: any) => {
        this.products = data;
        this.products$.next(this.products);
      });
    return this.products$.asObservable();
  }

  crearProducto(product: Product) {
    this.http
      .post(`${this.base_url}/product/create`, product)
      .subscribe((data: any) => {
        console.log(data);

        this.products.push({ ...data, value: null });
        this.products$.next(this.products);
      });
    return this.products$;
  }

  crearProductoConDescuento(product: Product) {
    console.log(product);

    this.http
      .post(`${this.base_url}/product/create-with-discount`, product)
      .subscribe((data: any) => {
        console.log(data);
        if (data.code !== 400) {
          this.products.push({ ...data.product, ...data.product.discounts });
          this.products$.next(this.products);
        }
      });
    return this.products$;
  }

  obtenerRecienteAntiguo() {
    // return this.http.get<{ ok: boolean; products: Product[] }>(
    //   `${this.base_url}/product/recent-to-old`
    // );
    this.products = this.products.sort(function (a, b) {
      if (typeof a.start_date === 'undefined' || a.start_date === null)
        return +17280000000;
      if (typeof b.start_date === 'undefined' || b.start_date === null)
        return -17280000000;
      const dateA = new Date(a.start_date),
        dateB = new Date(b.start_date);

      return dateA.valueOf() - dateB.valueOf();
    });

    this.products$.next(this.products);
  }

  obtenerAntiguoReciente() {
    // return this.http.get<{ ok: boolean; products: Product[] }>(
    //   `${this.base_url}/product/old-to-recent`
    // );
    this.products = this.products.sort(function (a, b) {
      if (typeof a.start_date === 'undefined' || a.start_date === null)
        return +17280000000;
      if (typeof b.start_date === 'undefined' || b.start_date === null)
        return -17280000000;
      const dateA = new Date(a.start_date),
        dateB = new Date(b.start_date);

      return dateB.valueOf() - dateA.valueOf();
    });

    this.products$.next(this.products);
  }
}
