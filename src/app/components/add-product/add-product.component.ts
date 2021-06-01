import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  closeResult: string = '';
  public productForm: FormGroup;
  constructor(
    private modalService: NgbModal,
    private _productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      title: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      description: [''],
      price: ['', Validators.compose([Validators.required, Validators.min(1)])],
    });
  }

  get title() {
    return this.productForm.get('title');
  }
  get description() {
    return this.productForm.get('description');
  }
  get price() {
    return this.productForm.get('price');
  }
  ngOnInit(): void {}
  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  crearProducto(modal: any) {
    console.log(this.productForm.value);
    // TODO: falta mostrarle el error al usuario del campo que no es correcto
    if (this.productForm.invalid) {
      console.log('Hay errores');
      return;
    }
    //Crear el producto
    this._productService.crearProducto(this.productForm.value);
    // .subscribe((response: any) => {
    //   console.log(response);
    //   this.obtenerProductos();
    // }, console.log);
    // Si el producto tiene sus campos correctos, entonces cierra el modal.
    modal.close('Save click');
    //Mensaje de confirmacion de que el producto se creo
    Swal.fire('Creado', 'Producto creado Satisfactoriamente!', 'success');
  }
}
