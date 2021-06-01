import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../interfaces/cart';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: Cart[] = [];
  closeResult = '';

  constructor(
    public _cartService: CartService,
    private modalService: NgbModal
  ) {
    this._cartService.getCart().subscribe((data) => {
      this.cart = data;
    });
  }

  ngOnInit(): void {}
  /**
   * Funcion para eliminar un item del carrito
   */
  borrarDelCarrito(item: Cart) {
    Swal.fire({
      title: '¿Desea quitar ' + item.title + ' del carrito?',
      showCancelButton: true,
      confirmButtonText: `Quitar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._cartService.removeItemFromCart(item.id);
        Swal.fire(
          'Eliminado',
          `El producto ${item.title} fue quitado del carrito`,
          'success'
        );
      }
    });
  }
  pagar(modal: any) {
    this._cartService.makePay();
    Swal.fire(
      'Pago realizado con exito!',
      'Su pago se realizó satisfactoriamente',
      'success'
    );
    modal.close('Save click');
  }

  getTotal() {
    return this._cartService.getTotal();
  }

  addElementToCart(id: number) {
    this._cartService.addOneElementToCart(id);
  }
  removeElementFromCart(id: number) {
    this._cartService.removeOneElementToCart(id);
  }
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
