import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
// import { UsersActions } from '../../store';
import { ShopCreateDto, ShopItemDto } from '../../../core/api';
// import { selectUsersError } from '../../store/selectors/status.selectors';
import { selectUsersError } from 'src/app/users/store/selectors/status.selectors';
import { ShopsActions } from '../../store';

@Component({
  selector: 'app-create-shop-form',
  templateUrl: './create-shop-form.component.html',
  styleUrls: ['./create-shop-form.component.scss'],
})
export class CreateShopFormComponent {
  addForm = new FormGroup({
    shopName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
    alvara: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    nif: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    contactPhone: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    address: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    products: new FormControl<ShopItemDto[]>([], {
      nonNullable: true,
    }),
  });

  constructor(private store: Store) {}

  async add() {
    this.store.dispatch(
      ShopsActions.addShop({
        data: this.addForm.getRawValue() as ShopCreateDto,
      }),
    );
  }
}
