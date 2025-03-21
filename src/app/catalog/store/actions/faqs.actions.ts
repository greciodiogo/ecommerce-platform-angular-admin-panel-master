import { createAction, props } from '@ngrx/store';
import { Faq, FaqCreateDto, FaqUpdateDto } from '../../../core/api';

export const loadFaqs = createAction('[Faqs] Load Faqs');

export const loadFaqsSuccess = createAction(
  '[Faqs] Load Faqs Success',
  props<{ faqs: Faq[] }>(),
);

export const loadFaqsFailure = createAction(
  '[Faqs] Load Faqs Failure',
  props<{ error: string }>(),
);

export const selectFaq = createAction(
  '[Faqs] Select Faq',
  props<{ faqId: number | null }>(),
);

export const addFaq = createAction(
  '[Faqs] Add Faq',
  props<{ data: FaqCreateDto }>(),
);

export const addFaqSuccess = createAction(
  '[Faqs] Add Faq Success',
  props<{ faq: Faq }>(),
);

export const addFaqFailure = createAction(
  '[Faqs] Add Faq Failure',
  props<{ error: string }>(),
);

export const updateFaq = createAction(
  '[Faqs] Update Faq',
  props<{ id: number; data: FaqUpdateDto }>(),
);

export const updateFaqSuccess = createAction(
  '[Faqs] Update Faq Success',
  props<{ id: number; faq: Faq }>(),
);

export const updateFaqFailure = createAction(
  '[Faqs] Update Faq Failure',
  props<{ error: string }>(),
);

export const deleteFaq = createAction(
  '[Faqs] Delete Faq',
  props<{ id: number }>(),
);

export const deleteFaqSuccess = createAction(
  '[Faqs] Delete Faq Success',
  props<{ id: number }>(),
);

export const deleteFaqFailure = createAction(
  '[Faqs] Delete Faq Failure',
  props<{ error: string }>(),
);
