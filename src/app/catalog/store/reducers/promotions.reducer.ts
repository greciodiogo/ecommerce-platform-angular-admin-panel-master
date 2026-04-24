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
    (state, { promotion }): PromotionState => {
      const existingIndex = state.list.findIndex((p) => p.id === promotion.id);
      
      if (existingIndex >= 0) {
        // Update existing promotion
        return {
          ...state,
          list: state.list.map((p) => (p.id === promotion.id ? promotion : p)),
        };
      } else {
        // Add new promotion to list
        return {
          ...state,
          list: [...state.list, promotion],
        };
      }
    },
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
); 