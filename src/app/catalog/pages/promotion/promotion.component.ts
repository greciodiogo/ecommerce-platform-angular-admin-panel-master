import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { selectPromotionDetails } from '../../store/selectors/promotions.selectors';
import { Promotion } from 'src/app/core/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
})
export class PromotionComponent implements OnInit, OnDestroy {
  promotionId: number | null = null;
  promotion$: Observable<Promotion | null> = this.store.select(selectPromotionDetails);

  constructor(private store: Store, private route: ActivatedRoute) {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.promotionId = idParam ? +idParam : null;
  }
  
  ngOnInit() {
    if (this.promotionId) {
      // Primeiro seleciona a promoção
      this.store.dispatch(PromotionsActions.selectPromotion({ promotionId: this.promotionId }));
      // Depois busca os detalhes
      this.store.dispatch(PromotionsActions.getPromotion({ promotionId: this.promotionId }));
    }
  }

  ngOnDestroy() {
    // Limpa a seleção ao sair do componente
    this.store.dispatch(PromotionsActions.selectPromotion({ promotionId: null }));
  }
}
