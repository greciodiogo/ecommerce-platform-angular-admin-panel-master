import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FaqsActions, selectFaqsList } from '../../store';
@Component({
  selector: 'app-create-faq-form',
  templateUrl: './create-faq-form.component.html',
  styleUrls: ['./create-faq-form.component.scss'],
})
export class CreateFaqFormComponent {
  addForm = new FormGroup({
    question: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    answer: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    visible: new FormControl('true', {
      nonNullable: true,
    }),
  });
  newFaqId$ = this.store.select(selectFaqsList);

  constructor(private store: Store) {}

  async save() {
    this.store.dispatch(
      FaqsActions.addFaq({
        data: {
          ...this.addForm.getRawValue(),
          visible: this.addForm.value.visible === 'true',
        },
      }),
    );
  }
}
