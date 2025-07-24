import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { selectProductsList } from '../../store';
import { Category, Promotion } from '../../../core/api';
import { FormControl } from '@angular/forms';
import { combineLatestWith, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectUserRole } from 'src/app/core/auth/store';
import { ProductsActions } from '../../store/actions';

@Component({
  selector: 'app-categories-products-add-form',
  templateUrl: './categories-products-add-form.component.html',
  styleUrls: ['./categories-products-add-form.component.scss'],
})
export class CategoriesProductsAddFormComponent implements OnInit {
  @Input() category: Category | null = null;
  @Input() promotion: Promotion | null = null;
  @Output() addProduct = new EventEmitter<number>();

  role$ = this.store.select(selectUserRole);
  products$ = this.store.select(selectProductsList);

  selectedProducts = new FormControl<number[]>([], {
    nonNullable: true,
  });
  productsFilter = new FormControl<string>('', { nonNullable: true });

  filteredProducts$ = this.products$.pipe(
    combineLatestWith(this.productsFilter.valueChanges.pipe(startWith(''))),
    map(([products, filter]) => {
      if (!products) {
        return [];
      }
      
      const container = this.category || this.promotion;
      let filteredProducts = [...products];

      // Remove already added products
      if (container && container.products) {
        const existingProductIds = container.products.map(p => p.id);
        filteredProducts = products.filter(
          ({ id }) => !existingProductIds.includes(id)
        );
      }

      // Apply search filter
      if (filter) {
        filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(filter.toLowerCase())
        );
      }

      return filteredProducts;
    })
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Load products list when component initializes
    this.store.dispatch(ProductsActions.loadProducts({}));
  }

  add(): void {
    if (!this.selectedProducts.value.length) {
      return;
    }

    // Emit each selected product ID with a slight delay to ensure proper processing
    this.selectedProducts.value.forEach((productId, index) => {
      setTimeout(() => {
        this.addProduct.emit(productId);
      }, index * 100); // Add 100ms delay between each emission
    });

    // Reset the selection
    this.selectedProducts.setValue([]);
  }
}
