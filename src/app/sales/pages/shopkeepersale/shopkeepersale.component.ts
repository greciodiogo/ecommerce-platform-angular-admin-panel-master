import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ShopkeeperSalesActions } from '../../store';

@Component({
  selector: 'app-shopkeepersale',
  templateUrl: './shopkeepersale.component.html',
  styleUrls: ['./shopkeepersale.component.scss'],
})
export class ShopkeeperSaleComponent implements OnInit, OnDestroy {
  private subscription: Subscription | undefined;
  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.store.dispatch(
        ShopkeeperSalesActions.selectShopkeeperSale({
          shopkeeperSaleId: params['id'],
        }),
      );
    });
  }

  ngOnDestroy() {
    this.store.dispatch(
      ShopkeeperSalesActions.selectShopkeeperSale({ shopkeeperSaleId: null }),
    );
    this.subscription?.unsubscribe();
  }
} 