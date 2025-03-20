import { createSelector } from '@ngrx/store';
import { selectCatalogState } from './index';
import * as fromFaqs from '../reducers/products.reducer';

export const selectFaqsState = createSelector(
  selectCatalogState,
  (state) => state[fromFaqs.productsFeatureKey],
);

export const selectFaqsList = createSelector(
  selectFaqsState,
  (state) => state.list,
);
export const selectSelectedFaqId = createSelector(
  selectFaqsState,
  (state) => state.selectedFaqId,
);

export const selectSelectedFaq = createSelector(
  selectFaqsState,
  selectSelectedFaqId,
  (state, selectedFaqId) =>
    selectedFaqId ? state.list.find((p) => p.id === selectedFaqId) : null,
);
