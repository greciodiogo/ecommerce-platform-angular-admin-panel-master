import { createReducer, on } from '@ngrx/store';
import { Faq } from '../../../core/api';
import { FaqsActions } from '../actions';

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
    FaqsActions.getFaqsuccess,
    (state, action): State => ({
      ...state,
      list: state.list.map((f) => (f.id === action.faq.id ? action.faq : f)),
    }),
  ),
  on(
    FaqsActions.createFaqsuccess,
    (state, action): State => ({
      ...state,
      list: [...state.list, action.faq],
    }),
  ),
  on(
    FaqsActions.updateFaqsuccess,
    (state, action): State => ({
      ...state,
      list: state.list.map((f) =>
        f.id === action.faqId ? { ...f, ...action.faq } : f,
      ),
    }),
  ),
);
