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
    answer: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    visible: new FormControl('true', {
      nonNullable: true,
    }),
  });

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
      answer: this.faq.answer,
      visible: this.faq.visible.toString(),
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
          answer: this.editForm.value.answer,
          visible: this.editForm.value.visible === 'true',
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
