import { Component, Input, OnInit } from '@angular/core';
import { Category, Promotion } from '../../../core/api';
import { Store } from '@ngrx/store';
import { CategoriesActions } from '../../store';
import * as PromotionsActions from '../../store/actions/promotions.actions';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.scss'],
})
export class CategoryProductsComponent implements OnInit {
  @Input() category: Category | null = null;
  @Input() promotion: Promotion | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    if (this.category) {
      this.store.dispatch(
        CategoriesActions.getCategoryProducts({ id: this.category.id }),
      );
    } else if (this.promotion) {
      this.store.dispatch(
        PromotionsActions.getPromotion({ promotionId: this.promotion.id })
      );
    }
  }

  deleteProduct(id: number) {
    if (this.category) {
      this.store.dispatch(
        CategoriesActions.deleteCategoryProduct({
          categoryId: this.category.id,
          productId: id,
        })
      );
    } else if (this.promotion) {
      this.store.dispatch(
        PromotionsActions.deletePromotionProduct({
          promotionId: this.promotion.id,
          productId: id,
        })
      );
    }
  }

  onAddProduct(productId: number) {
    if (this.category) {
      this.store.dispatch(
        CategoriesActions.addCategoryProduct({
          categoryId: this.category.id,
          productId
        })
      );
    } else if (this.promotion) {
      this.store.dispatch(
        PromotionsActions.addPromotionProduct({
          promotionId: this.promotion.id,
          productId
        })
      );
    }
  }

  getProducts(): any[] {
    return this.category?.products || this.promotion?.products || [];
  }
}
