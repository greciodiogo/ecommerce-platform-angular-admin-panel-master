import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductsActions } from '../../store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductPhotosInputComponent } from '../product-photos-input/product-photos-input.component';
import { Product } from '../../../core/api';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { selectUserRole } from 'src/app/core/auth/store';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
    role$ = this.store.select(selectUserRole);  
  @Input() product: Product | null = null;

  editForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
    purchasePrice: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(100)],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(100)],
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    // comission: new FormControl(0, {
    //   nonNullable: true,
    //   validators: [Validators.required, Validators.min(0), Validators.max(100)],
    // }),
    visible: new FormControl('true', {
      nonNullable: true,
    }),
  });

  @ViewChild(ProductPhotosInputComponent)
  photosInput!: ProductPhotosInputComponent;

  photosInputDirty = false;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.resetValues();
  }

  async resetValues() {
    if (!this.product) {
      return;
    }
    this.editForm.reset({
      name: this.product.name,
      description: this.product.description,
      purchasePrice: this.product.purchasePrice,
      price: this.product.price,
      stock: this.product.stock,
      // comission: this.product.stock,
      visible: this.product.visible.toString(),
    });
  }

  async save() {
    if (!this.product) {
      return;
    }
    this.store.dispatch(
      ProductsActions.updateProduct({
        id: this.product.id,
        data: {
          name: this.editForm.value.name,
          description: this.editForm.value.description,
          purchasePrice: this.editForm.value.purchasePrice,
          price: this.editForm.value.price,
          stock: this.editForm.value.stock,
          // comission: this.editForm.value.comission,
          visible: this.editForm.value.visible === 'true',
        },
      }),
    );
    await this.photosInput.save();
    await this.editForm.markAsPristine();
    this.snackBar.open('Product Updated', '', { duration: 2000 });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete product',
        message: 'Are you sure you want to delete this product?',
        confirmButton: 'Delete',
      },
    });

    this.snackBar.open('Product Deleted', '', { duration: 2000 });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && this.product) {
        this.store.dispatch(
          ProductsActions.deleteProduct({ id: this.product.id }),
        );
        await this.router.navigate(['/catalog/products']);
      }
    });
  }
}
