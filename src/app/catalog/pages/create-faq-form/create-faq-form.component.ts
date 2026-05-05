import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FaqsActions, selectCatalogLoading, selectFaqsList } from '../../store';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { selectUserRole } from 'src/app/core/auth/store';
@Component({
  selector: 'app-create-faq-form',
  templateUrl: './create-faq-form.component.html',
  styleUrls: ['./create-faq-form.component.scss'],
})
export class CreateFaqFormComponent {
  role$ = this.store.select(selectUserRole);
  
  categories = [
    { value: 'general', label: 'General' },
    { value: 'account', label: 'Account' },
    { value: 'orders', label: 'Orders' },
    { value: 'payments', label: 'Payments' },
    { value: 'delivery', label: 'Delivery' }
  ];

  addForm = new FormGroup({
    question: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    answer: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    question_en: new FormControl('', {
      nonNullable: true,
    }),
    answer_en: new FormControl('', {
      nonNullable: true,
    }),
    category: new FormControl('general', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    order: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    visible: new FormControl('true', {
      nonNullable: true,
    }),
  });
  newFaqId$ = this.store.select(selectFaqsList);

  constructor(private store: Store, private router: Router) {}

  async save() {
    const formValue = this.addForm.getRawValue();
    this.store.dispatch(
      FaqsActions.addFaq({
        data: {
          question: formValue.question,
          answer: formValue.answer,
          question_en: formValue.question_en || null,
          answer_en: formValue.answer_en || null,
          category: formValue.category,
          order: formValue.order,
          is_active: formValue.visible === 'true',
        },
      }),
    );

    this.newFaqId$.pipe(first((v) => v !== null)).subscribe(async (value) => {
      if (value) {
        await this.redirectToFaq(value);
      }
    });
  }

  private async redirectToFaq(faqId: any) {
    this.store
      .select(selectCatalogLoading)
      .pipe(first((v) => !v))
      .subscribe(() => {
        this.router.navigate(['/catalog/faqs', faqId]);
      });
  }
}
