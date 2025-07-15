import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ShopsActions, selectShopDetails } from '../../store';
import { ProductsActions, selectProductsByShop } from '../../store';
import { Shop } from 'src/app/core/api/model/shop';
import { Product } from 'src/app/core/api/model/product';

@Component({
  selector: 'app-shop-detail-tabs',
  templateUrl: './shop-detail-tabs.component.html',
  styleUrls: ['./shop-detail-tabs.component.scss']
})
export class ShopDetailTabsComponent implements OnInit {
  shopId: number | null = null;
  shop$: Observable<Shop | null>;
  products$: Observable<Product[]>;

  constructor(private route: ActivatedRoute, private store: Store) {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.shopId = idParam ? +idParam : null;
    this.shop$ = this.store.select(selectShopDetails);
    this.products$ = this.store.select(selectProductsByShop(this.shopId ?? 0));
  }

  ngOnInit(): void {
    if (this.shopId !== null) {
      this.store.dispatch(ShopsActions.loadShopById({ id: this.shopId }));
      this.store.dispatch(ProductsActions.loadProductsByShopId({ shopId: this.shopId }));
    }
  }
} 