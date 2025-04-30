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

  constructor(private store: Store, private router: Router) {}

  async save() {
    this.store.dispatch(
      FaqsActions.addFaq({
        data: {
          ...this.addForm.getRawValue(),
          visible: this.addForm.value.visible === 'true',
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
