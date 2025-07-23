import { Component, OnInit, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

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
    // categoryIds: new FormControl([], {
    //   nonNullable: true,
    //   validators: [Validators.required],
    // }),
    isActive: new FormControl(true, {
      nonNullable: true,
    }),
  });

  constructor(
    private store: Store,
    private actions$: Actions,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<CreatePromotionFormComponent>
  ) {}

  ngOnInit() {}

  save() {
    this.store.dispatch(
      PromotionsActions.createPromotion({
        data: {
          name: this.createForm.value.name,
          description: this.createForm.value.description,
          startDate: this.createForm.value.startDate ? new Date(this.createForm.value.startDate).toISOString() : '',
          endDate: this.createForm.value.endDate ? new Date(this.createForm.value.endDate).toISOString() : '',
          discount: this.createForm.value.discount,
          // categoryIds: this.createForm.value.categoryIds,
          isActive: this.createForm.value.isActive,
        },
      })
    );
    this.actions$
      .pipe(ofType(PromotionsActions.createPromotionSuccess), take(1))
      .subscribe(() => {
        if (this.dialogRef) {
          this.dialogRef.close();
        } else {
          this.router.navigate(['catalog/promotions']);
        }
      });
  }
}
