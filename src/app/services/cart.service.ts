import { Injectable } from '@angular/core';
import { empty, Observable, Subject } from 'rxjs';
import { Cart } from '../interfaces/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$ = new Subject<Cart[]>();
  cart: Cart[] = [];

  constructor() {}

  addOneElementToCart(element: Cart | number) {
    if (typeof element === 'number') {
      const newCart = this.cart.filter((c: Cart) =>
        c.id === element ? { ...c, quanti: c.quanti++ } : c
      );
      return this.cart$.next(newCart);
    }
    this.cart.push({ ...element });
    return this.cart$.next(this.cart);
  }

  removeItemFromCart(id: number) {
    this.cart = this.cart.filter((c) => c.id !== id);
    this.cart$.next(this.cart);
  }

  makePay() {
    this.cart = [];
    this.cart$.next(this.cart);
  }

  getTotal() {
    let total = 0;
    for (let cart of this.cart) {
      total += cart.price * cart.quanti;
    }
    return total;
  }

  removeOneElementToCart(id: number) {
    const newCart = this.cart.filter((e) =>
      e.id === id ? { ...e, quanti: e.quanti--, total: e.quanti * e.price } : e
    );
    return this.cart$.next(newCart);
  }

  getCart() {
    return this.cart$.asObservable();
  }

  findExistingCart(id: number) {
    return typeof this.cart.find((c) => c.id === id) !== 'undefined';
  }
}
