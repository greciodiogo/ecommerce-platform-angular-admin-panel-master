import { createReducer, on } from '@ngrx/store';
import { FaqsActions } from '../actions';
import { Faq } from 'src/app/core/api';

export const faqsFeatureKey = 'faqs';

export interface State {
  list: Faq[];
  selectedFaqId: number | null;
}

export const initialState: State = {
  list: [],
  selectedFaqId: null,
};

export const reducer = createReducer(
  initialState,
  on(
    FaqsActions.loadFaqsSuccess,
    (state, { faqs }): State => ({
      ...state,
      list: faqs,
    }),
  ),
  on(
    FaqsActions.selectFaq,
    (state, { faqId }): State => ({
      ...state,
      selectedFaqId: faqId,
    }),
  ),
  on(
    FaqsActions.addFaqSuccess,
    (state, { faq }): State => ({
      ...state,
      list: [...state.list, { ...faq }],
    }),
  ),
  on(
    FaqsActions.updateFaqSuccess,
    (state, { id, faq }): State => ({
      ...state,
      list: state.list.map((p) => (p.id === id ? faq : p)),
    }),
  ),
  on(
    FaqsActions.deleteFaqSuccess,
    (state, { id }): State => ({
      ...state,
      list: state.list.filter((p) => p.id !== id),
    }),
  ),
);
