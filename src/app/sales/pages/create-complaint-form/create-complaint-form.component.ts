import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  OrdersActions,
  selectDeliveryMethodsList,
  selectNewOrderId,
  selectPaymentMethodsList,
  selectSalesLoading,
} from '../../store';
import { ProductsActions, selectProductsList } from '../../../catalog/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, firstValueFrom, take } from 'rxjs';
import { OrderItemsInputComponent } from '../../components/order-items-input/order-items-input.component';

@Component({
  selector: 'app-create-complaint-form',
  templateUrl: './create-complaint-form.component.html',
  styleUrls: ['./create-complaint-form.component.scss'],
})
export class CreateComplaintFormComponent implements OnInit {
  createForm = new FormGroup({
    contactEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    contactPhone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    message: new FormControl<string | null>(null),
    deliveryMethodId: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  @ViewChild(OrderItemsInputComponent) itemsInput!: OrderItemsInputComponent;

  deliveryMethods$ = this.store.select(selectDeliveryMethodsList);
  paymentMethods$ = this.store.select(selectPaymentMethodsList);
  products$ = this.store.select(selectProductsList);

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
  }

  async save() {
    // this.store.dispatch(
    //   OrdersActions.createOrder({
    //     data: {
    //       contactEmail: this.createForm.controls.contactEmail.value,
    //       contactPhone: this.createForm.controls.contactPhone.value,
    //       fullName: this.createForm.controls.fullName.value,
    //       message: this.createForm.controls.message.value ?? undefined,
    //     },
    //   }),
    // );
    // this.store
    //   .select(selectSalesLoading)
    //   .pipe(
    //     first((v) => !v),
    //     take(1),
    //   )
    //   .subscribe(async () => {
    //     await this.router.navigate([
    //       'sales/complaints',
    //       await firstValueFrom(this.store.select(selectNewOrderId)),
    //     ]);
    //   });
  }
}
