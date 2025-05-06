import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../../core/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import StatusEnum = Order.StatusEnum;
import { Store } from '@ngrx/store';

import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: 'app-edit-complaint-form',
  templateUrl: './edit-complaint-form.component.html',
  styleUrls: ['./edit-complaint-form.component.scss'],
})
export class EditComplaintFormComponent implements OnInit {
  role$ = this.store.select(selectUserRole);
  
  @Input() complaint: Order | null = null;

  editForm = new FormGroup({
    status: new FormControl<StatusEnum>('pending', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
  });

  constructor(private store: Store) {}

  resetValues() {
    this.editForm.reset({
      status: this.complaint?.status,
      description: this.complaint?.delivery.deliveryStatus,
    });
  }

  ngOnInit() {
    this.resetValues();
  }

  save() {
    // if (!this.order || !this.order.delivery) {
    //   return;
    // }
    // this.store.dispatch(
    //   OrdersActions.updateOrder({
    //     orderId: this.order.id,
    //     data: {
    //       status: this.editForm.getRawValue().status,
    //       description: this.editForm.getRawValue().description,
    //     },
    //   }),
    // );
  }
}
