import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoriesActions, selectCategoriesList, selectSelectedCategory } from '../../store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit, OnDestroy {
  promotionCategory$ = this.store.select(selectSelectedCategory);
  private categoriesSub?: Subscription;

  constructor(private store: Store) {}

  ngOnInit() {
    this.categoriesSub = this.store.select(selectCategoriesList).subscribe(categories => {
      const promoCat = categories.find(c => c.name?.toLowerCase() === 'promotions');
      if (promoCat) {
        this.store.dispatch(CategoriesActions.selectCategory({ categoryId: promoCat.id }));
      }
    });
  }

  ngOnDestroy() {
    if (this.categoriesSub) this.categoriesSub.unsubscribe();
    this.store.dispatch(CategoriesActions.selectCategory({ categoryId: null }));
  }
}
