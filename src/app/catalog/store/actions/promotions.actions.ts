import { createAction, props } from '@ngrx/store';
import { Promotion } from '../../../core/api/model/promotion';
import { PromotionCreateDto } from '../../../core/api/model/promotion-create-dto';
import { PromotionUpdateDto } from '../../../core/api/model/promotion-update-dto';

export const loadPromotions = createAction('[Promotions] Load Promotions');

export const loadPromotionsSuccess = createAction(
  '[Promotions] Load Promotions Success',
  props<{ promotions: Promotion[] }>(),
);

export const loadPromotionsFailure = createAction(
  '[Promotions] Load Promotions Failure',
  props<{ error: string }>(),
);

export const selectPromotion = createAction(
  '[Promotions] Select Promotion',
  props<{ promotionId: number | null }>(),
);

export const getPromotion = createAction(
  '[Promotions] Get Promotion',
  props<{ promotionId: number }>(),
);

export const getPromotionSuccess = createAction(
  '[Promotions] Get Promotion Success',
  props<{ promotion: Promotion }>(),
);

export const getPromotionFailure = createAction(
  '[Promotions] Get Promotion Failure',
  props<{ error: string }>(),
);

export const createPromotion = createAction(
  '[Promotions] Create Promotion',
  props<{ data: PromotionCreateDto }>(),
);

export const createPromotionSuccess = createAction(
  '[Promotions] Create Promotion Success',
  props<{ promotion: Promotion }>(),
);

export const createPromotionFailure = createAction(
  '[Promotions] Create Promotion Failure',
  props<{ error: string }>(),
);

export const updatePromotion = createAction(
  '[Promotions] Update Promotion',
  props<{ promotionId: number; data: PromotionUpdateDto }>(),
);

export const updatePromotionSuccess = createAction(
  '[Promotions] Update Promotion Success',
  props<{ promotionId: number; promotion: Promotion }>(),
);

export const updatePromotionFailure = createAction(
  '[Promotions] Update Promotion Failure',
  props<{ error: string }>(),
); 