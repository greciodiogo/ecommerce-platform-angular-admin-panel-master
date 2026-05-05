import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FaqsActions } from '../../store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Faq } from '../../../core/api';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: 'app-faq-details',
  templateUrl: './faq-details.component.html',
  styleUrls: ['./faq-details.component.scss'],
})
export class FaqDetailsComponent implements OnInit {
  role$ = this.store.select(selectUserRole);
  @Input() faq: Faq | null = null;

  editForm = new FormGroup({
    question: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    question_en: new FormControl('', {
      nonNullable: false,
    }),
    answer: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    answer_en: new FormControl('', {
      nonNullable: false,
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
    is_active: new FormControl('true', {
      nonNullable: true,
    }),
  });

  categories = [
    { value: 'orders', label: 'Orders / Pedidos' },
    { value: 'payment', label: 'Payment / Pagamento' },
    { value: 'delivery', label: 'Delivery / Entrega' },
    { value: 'account', label: 'Account / Conta' },
    { value: 'general', label: 'General / Geral' },
  ];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  async ngOnInit() {
    await this.resetValues();
  }

  async resetValues() {
    if (!this.faq) {
      return;
    }
    this.editForm.reset({
      question: this.faq.question,
      question_en: this.faq.question_en || '',
      answer: this.faq.answer,
      answer_en: this.faq.answer_en || '',
      category: this.faq.category || 'general',
      order: this.faq.order || 0,
      visible: this.faq.visible.toString(),
      is_active: (this.faq.is_active !== undefined ? this.faq.is_active : true).toString(),
    });
  }

  async save() {
    if (!this.faq) {
      return;
    }
    this.store.dispatch(
      FaqsActions.updateFaq({
        id: this.faq.id,
        data: {
          question: this.editForm.value.question,
          question_en: this.editForm.value.question_en,
          answer: this.editForm.value.answer,
          answer_en: this.editForm.value.answer_en,
          category: this.editForm.value.category,
          order: this.editForm.value.order,
          visible: this.editForm.value.visible === 'true',
          is_active: this.editForm.value.is_active === 'true',
        },
      }),
    );
    await this.editForm.markAsPristine();
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete faq',
        message: 'Are you sure you want to delete this faq?',
        confirmButton: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && this.faq) {
        this.store.dispatch(FaqsActions.deleteFaq({ id: this.faq.id }));
        await this.router.navigate(['/catalog/faqs']);
      }
    });
  }
}
