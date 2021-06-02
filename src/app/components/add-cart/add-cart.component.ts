import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from 'src/app/services/cart.service';
import { Product } from '../../interfaces/product';
import { Cart } from '../../interfaces/cart';
import Swal from 'sweetalert2';
import {toJSDate} from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar";

@Component({
  selector: 'app-add-cart',
  templateUrl: './add-cart.component.html',
  styleUrls: ['./add-cart.component.css'],
})
export class AddCartComponent implements OnInit {
  closeResult = '';

  @Input() product: Product = {
    id: -1,
    title: '',
    description: '',
    price: -1,
    value: 0,
    start_date: '',
    end_date: ''
  };

  constructor(
    private modalService: NgbModal,
    private _cartService: CartService
  ) {}
  ngOnInit(): void {}

  open(content: any) {
    if (this._cartService.findExistingCart(this.product.id)) {
      this.modalElementAlreadyAdded();
      return;
    }
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      });
  }

  addToCart(quanti: string, modal: any) {
    if (quanti === '') {
      return this.modalQuantiEmpty();
    }
    if (Number(quanti) < 1) {
      return this.modalQuantiLessThan1();
    }
    const cart: Cart = {
      id: this.product.id,
      title: this.product.title,
      price: this.product.price,
      quanti: Number(quanti),
    };
    this._cartService.addOneElementToCart(cart);
    modal.close();
    this.modalElementAdded(this.product.title);
  }

  private modalQuantiLessThan1() {
    Swal.fire('no permitido', 'la cantidad debe ser minimo de 1', 'error');
    return;
  }
  private modalElementAlreadyAdded() {
    Swal.fire(
      'no permitido',
      'este producto ya fue agregado al carro',
      'error'
    );
    return;
  }

  private modalQuantiEmpty() {
    Swal.fire('no permitido', 'La cantidad es requerida', 'error');
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
