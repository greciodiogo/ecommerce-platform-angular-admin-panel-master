import { createAction, props } from '@ngrx/store';
import { Promotion } from '../../../core/api/model/promotion';
import { PromotionCreateDto } from '../../../core/api/model/promotion-create-dto';
import { PromotionUpdateDto } from '../../../core/api/model/promotion-update-dto';
import { AddCategoryProductRequest } from '../../../core/api/model/add-category-product-request';
import { Product } from '../../../core/api/model/product';

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

export const addPromotionProduct = createAction(
  '[Promotions] Add Promotion Product',
  props<{ promotionId: number; productId: number }>(),
);

export const addPromotionProductSuccess = createAction(
  '[Promotions] Add Promotion Product Success',
  props<{ promotionId: number; product: Product }>(),
);

export const addPromotionProductFailure = createAction(
  '[Promotions] Add Promotion Product Failure',
  props<{ error: string }>(),
);

export const deletePromotionProduct = createAction(
  '[Promotions] Delete Promotion Product',
  props<{ promotionId: number; productId: number }>(),
);

export const deletePromotionProductSuccess = createAction(
  '[Promotions] Delete Promotion Product Success',
  props<{ promotionId: number; productId: number }>(),
);

export const deletePromotionProductFailure = createAction(
  '[Promotions] Delete Promotion Product Failure',
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