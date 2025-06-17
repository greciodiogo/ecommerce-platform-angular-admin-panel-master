import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrdersActions } from 'src/app/sales/store';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(OrdersActions.loadOrders());
  }
}
