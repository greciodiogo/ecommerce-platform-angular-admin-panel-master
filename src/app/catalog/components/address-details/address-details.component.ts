import { Component, Input, OnInit } from '@angular/core';
import { Address } from '../../../core/api/model/address';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AddressesActions from '../../store/actions/addresses.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss'],
})
export class AddressDetailsComponent implements OnInit {
  role$ = this.store.select(selectUserRole);
  @Input() address: Address | null = null;

  editForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    slug: new FormControl('', {
      nonNullable: true,
    }),
    visible: new FormControl(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.resetValues();
  }

  resetValues() {
    if (!this.address) {
      return;
    }
    this.editForm.reset({
      name: this.address.name,
      slug: this.address.slug,
      visible: this.address.visible,
    });
  }

  save() {
    if (!this.address) {
      return;
    }
    this.store.dispatch(
      AddressesActions.updateAddress({
        addressId: this.address.id,
        data: {
          name: this.editForm.value.name!,
          slug: this.editForm.value.slug!,
          visible: this.editForm.value.visible!,
        },
      }),
    );
    this.editForm.markAsPristine();
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Address',
        message: 'Are you sure you want to delete this address?',
        confirmButton: 'Delete',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.address) {
        this.store.dispatch(
          AddressesActions.deleteAddress({ addressId: this.address.id }),
        );
        this.router.navigate(['/catalog/addresses']);
      }
    });
  }
} 