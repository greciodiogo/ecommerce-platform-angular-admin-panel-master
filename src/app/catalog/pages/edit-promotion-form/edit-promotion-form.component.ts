import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { selectSelectedPromotion } from '../../store/selectors/promotions.selectors';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-promotion-form',
  templateUrl: './edit-promotion-form.component.html',
  styleUrls: ['./edit-promotion-form.component.scss'],
})
export class EditPromotionFormComponent implements OnInit {
  promotion$ = this.store.select(selectSelectedPromotion);
  promotionId: number | null = null;

  editForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
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
    isActive: new FormControl(true, {
      nonNullable: true,
    }),
  });

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0') || null;
    if (id) {
      this.promotionId = id;
      this.store.dispatch(PromotionsActions.selectPromotion({ promotionId: id }));
      this.store.dispatch(PromotionsActions.getPromotion({ promotionId: id }));

      // Wait for promotion to load and populate form
      this.promotion$
        .pipe(
          filter(promotion => promotion !== null && promotion.id === id),
          take(1)
        )
        .subscribe(promotion => {
          if (promotion) {
            this.editForm.patchValue({
              name: promotion.name,
              slug: promotion.slug,
              description: promotion.description || '',
              discount: promotion.discount,
              startDate: this.formatDateForInput(promotion.startDate),
              endDate: this.formatDateForInput(promotion.endDate),
              isActive: promotion.isActive,
            });
          }
        });
    }

    // Auto-generate slug from name
    this.editForm.get('name')?.valueChanges.subscribe(name => {
      if (name) {
        const slug = this.generateSlug(name);
        this.editForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  onSubmit() {
    if (this.editForm.invalid || !this.promotionId) {
      return;
    }

    const formValue = this.editForm.getRawValue();

    const promotionData = {
      name: formValue.name,
      slug: formValue.slug,
      description: formValue.description,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      discount: formValue.discount,
      isActive: formValue.isActive,
    };

    this.store.dispatch(
      PromotionsActions.updatePromotion({
        promotionId: this.promotionId,
        data: promotionData as any,
      })
    );

    this.router.navigate(['/catalog/promotions', this.promotionId]);
  }

  onCancel() {
    if (this.promotionId) {
      this.router.navigate(['/catalog/promotions', this.promotionId]);
    } else {
      this.router.navigate(['/catalog/promotions']);
    }
  }
}
