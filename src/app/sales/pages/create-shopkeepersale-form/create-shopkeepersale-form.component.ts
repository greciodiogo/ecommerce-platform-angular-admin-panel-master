import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ShopkeeperSalesActions,
  selectSalesLoading,
} from '../../store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, take } from 'rxjs';
import { ShopsActions, selectShopsList } from '../../../catalog/store';
import { ProductsActions, selectProductsList } from '../../../catalog/store';
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: 'app-create-shopkeepersale-form',
  templateUrl: './create-shopkeepersale-form.component.html',
  styleUrls: ['./create-shopkeepersale-form.component.scss'],
})
export class CreateShopkeeperSaleFormComponent implements OnInit {
  role$ = this.store.select(selectUserRole);
  createForm = new FormGroup({
    order_number: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    shopId: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    productIds: new FormControl<number[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    quantity: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  shops$ = this.store.select(selectShopsList);
  products$ = this.store.select(selectProductsList);

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(ShopsActions.loadShops());
    this.store.dispatch(ProductsActions.loadProducts({}));
  }

  async save() {
    this.store.dispatch(
      ShopkeeperSalesActions.createShopkeeperSale({
        data: {
          order_number: this.createForm.controls.order_number.value,
          shopId: this.createForm.controls.shopId.value,
          productIds: this.createForm.controls.productIds.value,
          quantity: this.createForm.controls.quantity.value,
        },
      }),
    );
    this.store
      .select(selectSalesLoading)
      .pipe(
        first((v) => !v),
        take(1),
      )
      .subscribe(async () => {
        await this.router.navigate(['/sales/shopkeepersales']);
      });
  }
} 