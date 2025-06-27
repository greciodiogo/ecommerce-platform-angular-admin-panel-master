import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoriesActions, selectCategoriesList, selectSelectedCategory } from '../../store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
})
export class TrendingComponent implements OnInit, OnDestroy {
  category$ = this.store.select(selectSelectedCategory);
  private categoriesSub?: Subscription;

  constructor(private store: Store) {}

  ngOnInit() {
    this.categoriesSub = this.store.select(selectCategoriesList).subscribe(categories => {
      const trendingCat = categories.find(c => c.name?.toLowerCase() === 'trending');
      if (trendingCat) {
        this.store.dispatch(CategoriesActions.selectCategory({ categoryId: trendingCat.id }));
      }
    });
  }

  ngOnDestroy() {
    if (this.categoriesSub) this.categoriesSub.unsubscribe();
    this.store.dispatch(CategoriesActions.selectCategory({ categoryId: null }));
  }
}
