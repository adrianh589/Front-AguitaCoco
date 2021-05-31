import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../interfaces/cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  @Input() titulo: string = 'Este producto no tiene titulo';
  @Input() descripcion: string =
    'Este producto no tiene una descripcion actualmente';
  @Input() product!: Product;

  constructor(private _cartService: CartService) {}

  ngOnInit(): void {}

  anadirAlcarrito({ id, title, price }: Product) {
    if (this._cartService.findExistingCart(id)) {
      this.modalElementAlreadyAdded();
      return;
    }
    const cart: Cart = {
      id,
      title,
      price,
      quanti: 1,
    };
    this._cartService.addOneElementToCart(cart);
    this.modalElementAdded(title);
  }

  private modalElementAlreadyAdded() {
    Swal.fire(
      'no permitido',
      'este producto ya fue agregado al carro',
      'error'
    );
    return;
  }

  private modalElementAdded(title: string) {
    Swal.fire(
      'Producto agregado',
      `El producto ${title} fue agregado al carrito`,
      'success'
    );
  }
}
