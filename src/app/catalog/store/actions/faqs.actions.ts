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

export const selectFaqNumber = createAction(
  '[Faqs] Select Faq',
  props<{ faqId: number }>(),
);

export const getFaq = createAction(
  '[Faqs] Get Faq',
  props<{ faqId: number }>(),
);

export const getFaqsuccess = createAction(
  '[Faqs] Get Faq Success',
  props<{ faq: Faq }>(),
);

export const getFaqFailure = createAction(
  '[Faqs] Get Faq Failure',
  props<{ error: string }>(),
);

export const createFaq = createAction(
  '[Faqs] Create Faq',
  props<{ data: FaqCreateDto }>(),
);

export const createFaqsuccess = createAction(
  '[Faqs] Create Faq Success',
  props<{ faq: Faq }>(),
);

export const createFaqFailure = createAction(
  '[Faqs] Create Faq Failure',
  props<{ error: string }>(),
);

export const updateFaq = createAction(
  '[Faqs] Update Faq',
  props<{ faqId: number; data: FaqUpdateDto }>(),
);

export const updateFaqsuccess = createAction(
  '[Faqs] Update Faq Success',
  props<{ faqId: number; faq: Faq }>(),
);

export const updateFaqFailure = createAction(
  '[Faqs] Update Faq Failure',
  props<{ error: string }>(),
);
