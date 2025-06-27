import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ShopkeeperSalesActions,
  selectSalesLoading,
} from '../../store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, take, combineLatest } from 'rxjs';
import { ShopsActions, selectShopsList } from '../../../catalog/store';
import { ProductsActions, selectProductsList } from '../../../catalog/store';
import { selectUserRole } from 'src/app/core/auth/store';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

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
    // shopId: new FormControl(0, {
    //   nonNullable: true,
    //   validators: [Validators.required],
    // }),
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

  productInputCtrl = new FormControl('');
  selectedProducts: any[] = [];
  filteredProducts$: Observable<any[]>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(ShopsActions.loadShops());
    this.store.dispatch(ProductsActions.loadProducts({}));

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.productInputCtrl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([products, input]) => {
        const filterValue = (input || '').toLowerCase();
        return products
          .filter((product: any) =>
            product.id.toString().includes(filterValue) ||
            product.name.toLowerCase().includes(filterValue)
          )
          .filter((product: any) => !this.selectedProducts.some(p => p.id === product.id));
      })
    );
  }

  selectProduct(event: MatAutocompleteSelectedEvent) {
    const product = event.option.value;
    this.selectedProducts.push(product);
    this.createForm.controls.productIds.setValue(this.selectedProducts.map(p => p.id));
    this.productInputCtrl.setValue('');
  }

  removeProduct(product: any) {
    this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
    this.createForm.controls.productIds.setValue(this.selectedProducts.map(p => p.id));
  }

  addProductFromInput(event: MatChipInputEvent) {
    // Optionally, handle manual entry if you want to allow it
    this.productInputCtrl.setValue('');
  }

  addProductFromInputSimple() {
    const input = this.productInputCtrl.value?.toLowerCase() || '';
    this.products$.pipe(take(1)).subscribe(products => {
      const found = products.find((product: any) =>
        product.id.toString() === input || product.name.toLowerCase() === input
      );
      if (found && !this.selectedProducts.some((p: any) => p.id === found.id)) {
        this.selectedProducts.push(found);
        this.createForm.controls.productIds.setValue(this.selectedProducts.map((p: any) => p.id));
      }
      this.productInputCtrl.setValue('');
    });
  }

  async save() {
    this.store.dispatch(
      ShopkeeperSalesActions.createShopkeeperSale({
        data: {
          order_number: this.createForm.controls.order_number.value,
          // shopId: this.createForm.controls.shopId.value,
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