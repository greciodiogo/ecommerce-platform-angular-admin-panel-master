import { createReducer, on } from '@ngrx/store';
import { Promotion } from '../../../core/api/model/promotion';
import * as PromotionsActions from '../actions/promotions.actions';

export const promotionsFeatureKey = 'promotions';

export interface PromotionState {
  list: Promotion[];
  selectedPromotionId: number | null;
}

export const initialState: PromotionState = {
  list: [],
  selectedPromotionId: null,
};

export const reducer = createReducer(
  initialState,
  on(
    PromotionsActions.loadPromotionsSuccess,
    (state, { promotions }): PromotionState => ({
      ...state,
      list: promotions,
    }),
  ),
  on(
    PromotionsActions.selectPromotion,
    (state, { promotionId }): PromotionState => ({
      ...state,
      selectedPromotionId: promotionId,
    }),
  ),
  on(
    PromotionsActions.getPromotionSuccess,
    (state, { promotion }): PromotionState => ({
      ...state,
      list: state.list.map((p) => (p.id === promotion.id ? promotion : p)),
    }),
  ),
  on(
    PromotionsActions.createPromotionSuccess,
    (state, { promotion }): PromotionState => ({
      ...state,
      list: [...state.list, promotion],
    }),
  ),
  on(
    PromotionsActions.updatePromotionSuccess,
    (state, { promotionId, promotion }): PromotionState => ({
      ...state,
      list: state.list.map((p) => (p.id === promotionId ? promotion : p)),
    }),
  ),
  on(
    PromotionsActions.addPromotionProductSuccess,
    (state, { promotionId, product }): PromotionState => ({
      ...state,
      list: state.list.map((p) => {
        if (p.id === promotionId) {
          return {
            ...p,
            products: [...(p.products || []), product]
          };
        }
        return p;
      }),
    }),
  ),
  on(
    PromotionsActions.deletePromotionProductSuccess,
    (state, { promotionId, productId }): PromotionState => ({
      ...state,
      list: state.list.map((p) => {
        if (p.id === promotionId) {
          return {
            ...p,
            products: (p.products || []).filter(prod => prod.id !== productId)
          };
        }
        return p;
      }),
    }),
  ),
); 