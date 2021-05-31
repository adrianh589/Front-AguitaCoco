import {Product} from "./product";

export interface Discount{
  id: number,
  product: Product
  value: number,
  start_date: Date,
  end_date: Date
}
