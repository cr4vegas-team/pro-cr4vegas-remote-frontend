import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { OrderEntity } from './order.entity';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _orders: BehaviorSubject<OrderEntity[]>;

  // ==================================================

  constructor() {
    this._orders = new BehaviorSubject<OrderEntity[]>(Array<OrderEntity>());
  }

  // ==================================================

  public get orders(): BehaviorSubject<OrderEntity[]> {
    return this._orders;
  }
}
