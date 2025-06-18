import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-create-promotion-form',
  templateUrl: './create-promotion-form.component.html',
  styleUrls: ['./create-promotion-form.component.scss'],
})
export class CreatePromotionFormComponent implements OnInit {
  createForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    startDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    endDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    discount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    categoryIds: new FormControl([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isActive: new FormControl(true, {
      nonNullable: true,
    }),
  });

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {}

  save() {
    this.store.dispatch(
      PromotionsActions.createPromotion({
        data: {
          name: this.createForm.controls.name.value,
          description: this.createForm.controls.description.value,
          startDate: this.createForm.controls.startDate.value,
          endDate: this.createForm.controls.endDate.value,
          discount: this.createForm.controls.discount.value,
          categoryIds: this.createForm.controls.categoryIds.value,
          isActive: this.createForm.controls.isActive.value,
        },
      })
    );
    // Optionally, listen for success and navigate
    this.router.navigate(['catalog/promotions']);
  }
}
