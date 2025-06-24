import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { selectSelectedPromotion } from '../../store/selectors/promotions.selectors';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
})
export class PromotionComponent implements OnInit, OnDestroy {
  promotion$ = this.store.select(selectSelectedPromotion);

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
