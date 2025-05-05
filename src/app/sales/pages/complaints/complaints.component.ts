import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrdersActions } from '../../store';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
})
export class ComplaintsComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(OrdersActions.loadOrders());
  }
}
