import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FaqsActions } from '../../store';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
})
export class FaqsComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(FaqsActions.loadOrders());
  }
}
