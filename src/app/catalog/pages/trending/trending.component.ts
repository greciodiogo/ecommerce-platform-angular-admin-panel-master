import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoriesActions, selectSelectedTrending } from '../../store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
})
export class TrendingComponent implements OnInit, OnDestroy {
  category$ = this.store.select(selectSelectedTrending);

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.store.dispatch(
      CategoriesActions.selectCategory({
        categoryId:
          parseInt(this.route.snapshot.paramMap.get('id') ?? '0') || null,
      }),
    );
  }

  ngOnDestroy() {
    this.store.dispatch(CategoriesActions.selectCategory({ categoryId: null }));
  }
}
