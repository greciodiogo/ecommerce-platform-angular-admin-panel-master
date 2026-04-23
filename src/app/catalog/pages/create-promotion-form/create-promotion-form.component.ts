import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    slug: new FormControl('', {
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
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
    isActive: new FormControl(true, {
      nonNullable: true,
    }),
  });

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    // Auto-generate slug from name
    this.createForm.controls.name.valueChanges.subscribe(name => {
      if (name && !this.createForm.controls.slug.dirty) {
        const slug = name.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        this.createForm.controls.slug.setValue(slug);
      }
    });
  }

  save() {
    if (!this.createForm.valid) {
      return;
    }

    const formValue = this.createForm.getRawValue();
    
    // Cast todo o objeto para contornar a limitação do DTO desatualizado
    const promotionData = {
      name: formValue.name,
      slug: formValue.slug,
      description: formValue.description,
      startDate: new Date(formValue.startDate).toISOString(),
      endDate: new Date(formValue.endDate).toISOString(),
      discount: formValue.discount,
      isActive: formValue.isActive,
    };
    
    this.store.dispatch(
      PromotionsActions.createPromotion({
        data: promotionData as any,
      })
    );
    
    this.router.navigate(['/catalog/promotions']);
  }
}
