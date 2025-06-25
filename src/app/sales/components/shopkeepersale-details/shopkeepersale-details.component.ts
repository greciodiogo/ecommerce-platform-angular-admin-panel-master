import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSelectedShopkeeperSale } from '../../store';

@Component({
  selector: 'app-shopkeepersale-details',
  templateUrl: './shopkeepersale-details.component.html',
  styleUrls: ['./shopkeepersale-details.component.scss'],
})
export class ShopkeeperSaleDetailsComponent {
  sale$ = this.store.select(selectSelectedShopkeeperSale);

  constructor(private store: Store) {}
} 