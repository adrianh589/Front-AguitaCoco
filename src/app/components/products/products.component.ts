import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../interfaces/product";
import Swal from "sweetalert2";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @Input() titulo: string = 'Este producto no tiene titulo';
  @Input() descripcion: string = 'Este producto no tiene una descripcion actualmente';
  @Input() product!: Product;

  constructor( private productService: ProductService ) { }

  ngOnInit(): void {
  }

  anadirAlcarrito(producto: Product){

    // Si el producto fue agregado, no se puede volver a agregar
    if (this.productService.carrito.find( pr => producto === pr)){
      Swal.fire('No permitido', 'Este producto ya fue agregado al carrito', 'error');
      return;
    }

    // Agregar al carrito
    Swal.fire('Producto agregado', `El producto ${producto.title} fue agregado al carrito`, 'success');
    this.productService.carrito.push(producto);
  }

}
