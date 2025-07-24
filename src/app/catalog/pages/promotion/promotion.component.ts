import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { selectSelectedPromotion } from '../../store/selectors/promotions.selectors';
import { PromotionsApiService } from 'src/app/core/api/api/promotions-api.service';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
})
export class PromotionComponent implements OnInit, OnDestroy {
  promotion$ = this.store.select(selectSelectedPromotion);

  constructor(
    private store: Store, 
    private route: ActivatedRoute,
    private promotionsApi: PromotionsApiService
  ) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0') || null;
    if (id) {
      this.store.dispatch(PromotionsActions.selectPromotion({ promotionId: id }));
      this.store.dispatch(PromotionsActions.getPromotion({ promotionId: id }));

      // Após carregar a promoção, obter os produtos
      this.promotion$.subscribe(promotion => {
        if (promotion) {
          this.promotionsApi.getPromotionProducts(promotion.id).subscribe(products => {
            this.store.dispatch(PromotionsActions.getPromotionSuccess({
              promotion: {
                ...promotion,
                products
              }
            }));
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.store.dispatch(PromotionsActions.selectPromotion({ promotionId: null }));
  }
}
