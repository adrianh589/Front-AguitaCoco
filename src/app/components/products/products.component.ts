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

  constructor() {}

  ngOnInit(): void {}
}
