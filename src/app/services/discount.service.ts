import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private url = environment.base_url;

  constructor(private http: HttpClient) {}
}
