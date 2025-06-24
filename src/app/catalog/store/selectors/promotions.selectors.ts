import { createSelector } from '@ngrx/store';
import * as fromPromotions from '../reducers/promotions.reducer';
import { Promotion } from '../../../core/api/model/promotion';
import { selectCatalogState } from './index';

export const selectPromotionsState = createSelector(
  selectCatalogState,
  (state) => state[fromPromotions.promotionsFeatureKey],
);

export const selectPromotionsList = createSelector(
  selectPromotionsState,
  (state) => state.list,
);

export const selectSelectedPromotionId = createSelector(
  selectPromotionsState,
  (state) => state.selectedPromotionId,
);

export const selectSelectedPromotion = createSelector(
  selectPromotionsState,
  selectSelectedPromotionId,
  (state, selectedPromotionId) => {
    return selectedPromotionId
      ? state.list.find((p) => p.id === selectedPromotionId)
      : null;
  },
); 