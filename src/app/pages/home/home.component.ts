import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Cart } from '../../interfaces/cart';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public products: Product[] = [];
  public productForm!: FormGroup;
  closeResult = '';
  private formSubmitted: boolean = false;
  cart: Cart[] = [];

  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public _cartService: CartService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required]],
      price: ['', Validators.pattern('[0-9]*')],
    });
    this._cartService.getCart().subscribe((data) => {
      this.cart = data;
    });
  }

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

  /**
   * Funcion para obtener los productos disponibles en la tienda
   */
  obtenerProductos() {
    this.productService.obtenerProductos().subscribe((products) => {
      this.products = products;
    });
  }

  /**
   * Funcion para realizar la creación de un nuevo producto en la tienda
   * @param modal
   */
  crearProducto(modal: any) {
    console.log(this.productForm.value);

    // TODO: falta mostrarle el error al usuario del campo que no es correcto
    if (this.productForm.invalid) {
      console.log('Hay errores');
      return;
    }

    //Crear el producto
    this.productService
      .crearProducto(this.productForm.value)
      .subscribe((response: any) => {
        console.log(response);
        this.obtenerProductos();
      }, console.log);

    // Si el producto tiene sus campos correctos, entonces cierra el modal.
    modal.close('Save click');

    //Mensaje de confirmacion de que el producto se creo
    Swal.fire('Creado', 'Producto creado Satisfactoriamente!', 'success');
  }

  /**
   * Funcion para simular un pago
   * @param modal
   */
  pagar(modal: any) {
    this._cartService.makePay();
    Swal.fire(
      'Pago realizado con exito!',
      'Su pago se realizó satisfactoriamente',
      'success'
    );
    modal.close('Save click');
  }

  /**
   * Funcion para validar los campos del usuario
   * @param campo
   */
  campoNoValido(campo: string): boolean {
    if (this.productForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  // Clases del ngbBootstrap
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

  getTotal() {
    return this._cartService.getTotal();
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
  addElementToCart(id: number) {
    this._cartService.addOneElementToCart(id);
  }
  removeElementFromCart(id: number) {
    this._cartService.removeOneElementToCart(id);
  }
}
