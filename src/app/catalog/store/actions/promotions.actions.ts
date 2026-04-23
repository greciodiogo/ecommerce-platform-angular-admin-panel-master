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

export const addPromotionProduct = createAction(
  '[Promotions] Add Product to Promotion',
  props<{ promotionId: number; productId: number }>(),
);

export const addPromotionProductSuccess = createAction(
  '[Promotions] Add Product to Promotion Success',
  props<{ promotionId: number }>(),
);

export const addPromotionProductFailure = createAction(
  '[Promotions] Add Product to Promotion Failure',
  props<{ error: string; statusCode?: number }>(),
);

export const removePromotionProduct = createAction(
  '[Promotions] Remove Product from Promotion',
  props<{ promotionId: number; productId: number }>(),
);

export const removePromotionProductSuccess = createAction(
  '[Promotions] Remove Product from Promotion Success',
  props<{ promotionId: number }>(),
);

export const removePromotionProductFailure = createAction(
  '[Promotions] Remove Product from Promotion Failure',
  props<{ error: string }>(),
); 