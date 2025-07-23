import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { Subscription } from 'rxjs';
import { selectSelectedCategory, selectSelectedPromotion } from '../../store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit, OnDestroy {
  promotionCategory$ = this.store.select(selectSelectedPromotion);

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
      const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0') || null;
      if (id) {
        this.store.dispatch(PromotionsActions.selectPromotion({ promotionId: id }));
        this.store.dispatch(PromotionsActions.getPromotion({ promotionId: id }));
      }
  }

  ngOnDestroy() {
    this.store.dispatch(PromotionsActions.selectPromotion({ promotionId: null }));
  }
}
