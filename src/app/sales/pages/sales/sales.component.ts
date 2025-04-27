import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrdersActions } from '../../store';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(OrdersActions.loadOrders());
  }
}
