import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  addDiscount: boolean = false;
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  constructor(
    private modalService: NgbModal,
    private _productService: ProductService,
    private fb: FormBuilder,
    calendar: NgbCalendar
  ) {
    this.productForm = this.fb.group({
      title: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      description: [''],
      price: [0, Validators.compose([Validators.required, Validators.min(1)])],
      discount: [
        0,
        Validators.compose([Validators.min(0), Validators.max(99.99)]),
      ],
    });
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
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

  get discount() {
    return this.productForm.get('discount');
  }

  getValue() {
    const value = this.productForm.get('discount')?.value;
    return value === null ? 0 : value;
  }

  ngOnInit(): void {}
  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  crearProducto(modal: any) {
    console.log(this.productForm.value);

    //Crear el producto
    if (this.addDiscount) {
      let title: string = this.title?.value;
      let description: string = this.description?.value;
      let price: number = this.price?.value;
      let value: number = this.discount?.value;
      this._productService.crearProductoConDescuento({
        title,
        description,
        price,
        start_date: this.parseDate(this.fromDate),
        value,
        end_date: this.parseDate(this.toDate),
      });
    } else {
      let title: string = this.title?.value;
      let description: string = this.description?.value;
      let price: number = this.price?.value;

      this._productService.crearProducto({ title, description, price });
    }

    // Si el producto tiene sus campos correctos, entonces cierra el modal.
    modal.close('Save click');
    //Mensaje de confirmacion de que el producto se creo
    Swal.fire('Creado', 'Producto creado Satisfactoriamente!', 'success');
  }

  private parseDate(date: NgbDate | null): string {
    if (date === null) return this.parseDate(this.fromDate);
    return `${date.year}-${date.month}-${date.day}`;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}
