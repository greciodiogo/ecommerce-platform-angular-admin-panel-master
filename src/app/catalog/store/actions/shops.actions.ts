import { createAction, props } from '@ngrx/store';
import { Shop, ShopCreateDto, ShopUpdateDto } from '../../../core/api';

export const loadShops = createAction('[Shops] Load Shops');

export const loadShopsSuccess = createAction(
  '[Shops] Load Shops Success',
  props<{ shops: Shop[] }>(),
);

export const loadShopsFailure = createAction(
  '[Shops] Load Shops Failure',
  props<{ error: string }>(),
);

export const selectShop = createAction(
  '[Shops] Select Shop',
  props<{ shopId: number | null }>(),
);

export const addShop = createAction(
  '[Shops] Add Shop',
  props<{ data: ShopCreateDto }>(),
);

export const addShopSuccess = createAction(
  '[Shops] Add Shop Success',
  props<{ shop: Shop }>(),
);

export const addShopFailure = createAction(
  '[Shops] Add Shop Failure',
  props<{ error: string }>(),
);

export const updateShop = createAction(
  '[Shops] Update Shop',
  props<{ id: number; data: ShopUpdateDto }>(),
);

export const updateShopSuccess = createAction(
  '[Shops] Update Shop Success',
  props<{ id: number; shop: Shop }>(),
);

export const updateShopFailure = createAction(
  '[Shops] Update Shop Failure',
  props<{ error: string }>(),
);

export const deleteShop = createAction(
  '[Shops] Delete Shop',
  props<{ id: number }>(),
);

export const deleteShopSuccess = createAction(
  '[Shops] Delete Shop Success',
  props<{ id: number }>(),
);

export const deleteShopFailure = createAction(
  '[Shops] Delete Shop Failure',
  props<{ error: string }>(),
);
