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
    // productIds: new FormControl<number[]>([], {
    //   nonNullable: true,
    //   validators: [Validators.required],
    // }),
    // quantity: new FormControl(0, {
    //   nonNullable: true,
    //   validators: [Validators.required, Validators.min(1)],
    // }),
  });

  shops$ = this.store.select(selectShopsList);
  products$ = this.store.select(selectProductsList);

  productInputCtrl = new FormControl('');
  selectedProducts: { product: any, quantity: number }[] = [];
  filteredProducts$: Observable<any[]>;
  productInputError: string = '';
  formError: string = '';

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
          .filter((product: any) => !this.selectedProducts.some(p => p.product.id === product.id));
      })
    );
  }

  selectProduct(event: MatAutocompleteSelectedEvent) {
    const product = event.option.value;
    if (this.selectedProducts.some(p => p.product.id === product.id)) {
      this.productInputError = 'Product already added.';
      this.productInputCtrl.setValue('');
      return;
    }
    this.selectedProducts.push({ product, quantity: 1 });
    this.productInputCtrl.setValue('');
    this.productInputError = '';
  }

  removeProduct(p: any) {
    this.selectedProducts = this.selectedProducts.filter(x => x.product.id !== p.product.id);
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
      if (!found) {
        this.productInputError = 'Product not found.';
      } else if (this.selectedProducts.some((p: any) => p.product.id === found.id)) {
        this.productInputError = 'Product already added.';
      } else {
        this.selectedProducts.push({ product: found, quantity: 1 });
        this.productInputError = '';
      }
      this.productInputCtrl.setValue('');
    });
  }

  validateQuantity(p: { product: any, quantity: number }) {
    if (p.quantity < 1) {
      p.quantity = 1;
    }
  }

  async save() {
    this.formError = '';
    if (this.selectedProducts.length === 0) {
      this.formError = 'At least one product is required.';
      return;
    }
    if (this.selectedProducts.some(p => !p.quantity || p.quantity < 1)) {
      this.formError = 'All quantities must be at least 1.';
      return;
    }
    this.store.dispatch(
      ShopkeeperSalesActions.createShopkeeperSale({
        data: {
          order_number: this.createForm.controls.order_number.value,
          products: this.selectedProducts.map(p => ({
            productId: p.product.id,
            quantity: p.quantity
          })),
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