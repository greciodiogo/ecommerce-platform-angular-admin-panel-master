import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PromotionsApiService } from '../../../core/api/api/promotions-api.service';
import { Promotion } from '../../../core/api/model/promotion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { selectUserRole } from 'src/app/core/auth/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-promotion-config',
  templateUrl: './promotion-config.component.html',
  styleUrls: ['./promotion-config.component.scss'],
})
export class PromotionConfigComponent implements OnInit {
  role$ = this.store.select(selectUserRole);
  promotion: Promotion | null = null;
  loading = true;

  editForm = new FormGroup({
    discount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
    startDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    endDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private promotionsApi: PromotionsApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.loadPromotion();
  }

  loadPromotion() {
    this.loading = true;
    this.promotionsApi.getPromotion(1).subscribe({
      next: (promotion) => {
        this.promotion = promotion;
        this.editForm.reset({
          discount: promotion.discount,
          startDate: promotion.startDate.split('T')[0],
          endDate: promotion.endDate.split('T')[0],
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading promotion:', error);
        this.snackBar.open('Erro ao carregar promoção', 'Fechar', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  resetValues() {
    if (!this.promotion) {
      return;
    }
    this.editForm.reset({
      discount: this.promotion.discount,
      startDate: this.promotion.startDate.split('T')[0],
      endDate: this.promotion.endDate.split('T')[0],
    });
  }

  save() {
    if (!this.promotion || !this.editForm.valid) {
      return;
    }

    const formValue = this.editForm.value;
    
    this.promotionsApi
      .updatePromotion(1, {
        discount: formValue.discount!,
        startDate: formValue.startDate!,
        endDate: formValue.endDate!,
      })
      .subscribe({
        next: (updatedPromotion) => {
          this.promotion = updatedPromotion;
          this.snackBar.open('Promoção atualizada com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.editForm.markAsPristine();
        },
        error: (error) => {
          console.error('Error updating promotion:', error);
          this.snackBar.open('Erro ao atualizar promoção', 'Fechar', {
            duration: 3000,
          });
        },
      });
  }

  goBack() {
    this.router.navigate(['/catalog/categories']);
  }
}
