import { createSelector } from '@ngrx/store';
import { selectCatalogState } from './index';
import * as fromFaqs from '../reducers/faqs.reducer';

export const selectFaqsState = createSelector(
  selectCatalogState,
  (state) => state[fromFaqs.faqsFeatureKey],
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
  selectFaqsList,
  selectSelectedFaqId,
  (faqs, selectedFaqId) => faqs.find((c) => c.id === selectedFaqId) ?? null,
);
