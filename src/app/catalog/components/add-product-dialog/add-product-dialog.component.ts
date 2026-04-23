import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../../core/api/model/product';
import { selectProductsList } from '../../store/selectors/products.selectors';
import * as ProductsActions from '../../store/actions/products.actions';
import { FormControl } from '@angular/forms';

export interface AddProductDialogData {
  promotionId: number;
  existingProductIds: number[];
}

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
})
export class AddProductDialogComponent implements OnInit {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  searchControl = new FormControl('');
  selectedProductId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddProductDialogData,
    private store: Store,
  ) {
    this.products$ = this.store.select(selectProductsList);
    this.filteredProducts$ = this.products$;
  }

  ngOnInit() {
    this.store.dispatch(ProductsActions.loadProducts());

    // Filter products based on search and exclude existing ones
    this.filteredProducts$ = this.products$.pipe(
      map(products => 
        products.filter(p => 
          !this.data.existingProductIds.includes(p.id) &&
          (this.searchControl.value ? 
            p.name.toLowerCase().includes(this.searchControl.value.toLowerCase()) ||
            p.id.toString().includes(this.searchControl.value)
            : true)
        )
      )
    );

    this.searchControl.valueChanges.subscribe(() => {
      this.filteredProducts$ = this.products$.pipe(
        map(products => 
          products.filter(p => 
            !this.data.existingProductIds.includes(p.id) &&
            (this.searchControl.value ? 
              p.name.toLowerCase().includes(this.searchControl.value.toLowerCase()) ||
              p.id.toString().includes(this.searchControl.value)
              : true)
          )
        )
      );
    });
  }

  selectProduct(productId: number) {
    this.selectedProductId = productId;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedProductId) {
      this.dialogRef.close(this.selectedProductId);
    }
  }
}
