import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Shop, ShopUpdateDto } from '../../../core/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ShopsActions } from '../../store'; 
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss'],
})
export class ShopDetailComponent implements OnInit {
  role$ = this.store.select(selectUserRole);
  
  @Input() shop!: Shop;

  @Output() cancel = new EventEmitter<void>();

  editForm = new FormGroup({
    shopName: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    alvara: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    nif: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.resetValues();
  }

  resetValues() {
    this.editForm.setValue({
      shopName: this.shop.shopName ?? null,
      alvara: this.shop.alvara ?? null,
      nif: this.shop.nif,
    });
  }

  save() {
    this.store.dispatch(
      ShopsActions.updateShop({
        id: this.shop.id,
        data: {
          shopName: this.editForm.value.shopName ?? undefined,
          alvara: this.editForm.value.alvara ?? undefined,
          nif: this.editForm.value.nif,
        },
      }),
    );
    this.snackBar.open('Shop updated', '', { duration: 2000 });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete shop',
        message: 'Are you sure you want to delete this shop?',
        confirmButton: 'Delete',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(ShopsActions.deleteShop({ id: this.shop.id }));
        this.snackBar.open('Shop deleted', '', { duration: 2000 });
      }
    });
  }
}
