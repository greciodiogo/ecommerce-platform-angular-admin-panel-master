import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(PromotionsActions.loadPromotions());
  }
}
