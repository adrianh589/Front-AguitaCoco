import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Cart } from '../../interfaces/cart';
import { CartService } from 'src/app/services/cart.service';
import {isNull} from "@angular/compiler/src/output/output_ast";
import {isEmpty} from "rxjs/operators";

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
  model!: NgbDateStruct;

  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public _cartService: CartService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.productForm = this.fb.group({
      title: ['Probando CORS', Validators.required],
      description: ['CORS', [Validators.required]],
      price: ['666', Validators.pattern('[0-9]*')],
      value: ['13', [Validators.required]],
      start_date: [''],
      end_date: ['']
    });
    this._cartService.getCart().subscribe((data) => {
      this.cart = data;
    });
  }

  /**
   * Ordenar los productos del mas reciente al mas antiguo
   */
  orderProductsAscendent(){
    this.productService.obtenerRecienteAntiguo()
      .subscribe( res => this.products = res.products );
  }

  /**
   * Ordenar los productos del mas antiguo al mas reciente
   */
  orderProductsDescendent(){
    this.productService.obtenerAntiguoReciente()
      .subscribe( res => this.products = res.products );
  }

  validPercent(input: string){
    if(Number(input) > 100){
      this.productForm.get('value')?.setValue('100');
    }
  }

  /**
   * Verificar Si el descuento es nulo para evitar poner las fechas
   * @param input Recibe el valor del campo Descuento
   */
  isNull(input: string){
    if(input === '' || input.startsWith('0') || input === null){
      this.productForm.get('start_date')?.setValue('');
      this.productForm.get('end_date')?.setValue('');
      return true;
    }
    return false;
  }

  /**
   * Funcion para obtener los productos disponibles en la tienda
   */
  obtenerProductos() {
    this.productService.obtenerProductos().subscribe((res) => {
      this.products = res.products;
    });
  }

  /**
   * Funcion para realizar la creación de un nuevo producto en la tienda
   * @param modal
   */
  crearProducto(modal: any) {
    console.log(this.productForm.value);

    // TODO: falta mostrarle el error al usuario del campo que no es correcto

    // Corregir descuento vacio
    if(this.productForm.get('value')?.value === '' || this.productForm.get('value')?.value === null){
      this.productForm.get('value')?.setValue(0);
    }

    if (this.productForm.invalid) {
      console.log('Hay errores');
      return;
    }

    // Parsear fecha inicio
    if(this.productForm.get('start_date')?.value !== '' ){
      const {day, month, year} = this.productForm.get('start_date')?.value;
      const fecha = `${year}-${month}-${day}`;
      this.productForm.get('start_date')?.setValue(fecha);
    }

    // Parsear fecha final
    if(this.productForm.get('end_date')?.value !== '' ){
      const {day, month, year} = this.productForm.get('end_date')?.value;
      const fecha = `${year}-${month}-${day}`;
      this.productForm.get('end_date')?.setValue(fecha);
    }

    //Crear el producto
    this.productService
      .crearProducto(this.productForm.value)
      .subscribe((response: any) => {
        console.log(response);
        //Mensaje de confirmacion de que el producto se creo
        Swal.fire('Creado', 'Producto creado Satisfactoriamente!', 'success');
        this.obtenerProductos();
      }, error => {
        //Mensaje de confirmacion de que el producto se creo
        Swal.fire('Error', error.error.error[0].end_date[0], 'error');
      });

    // Si el producto tiene sus campos correctos, entonces cierra el modal.
    modal.close('Save click');
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

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
