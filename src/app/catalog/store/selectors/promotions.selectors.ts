import { createSelector } from '@ngrx/store';
import * as fromPromotions from '../reducers/promotions.reducer';
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
  selectPromotionsList,
  selectSelectedPromotionId,
  (promotions, selectedPromotionId) => {
    return selectedPromotionId
      ? promotions.find((p) => p.id === selectedPromotionId)
      : null;
  },
); 

export const selectPromotionDetails = createSelector(
  selectPromotionsState,
  (state) => state.selectedPromotion
);

export const selectPromotionProducts = createSelector(
  selectPromotionDetails,
  (promotion) => promotion?.products || []
);