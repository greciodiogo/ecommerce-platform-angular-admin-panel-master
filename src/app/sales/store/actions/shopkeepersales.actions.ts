import { createAction, props } from '@ngrx/store';
import {
  ShopkeeperSale,
  ShopkeeperSaleCreateDto,
  ShopkeeperSaleUpdateDto,
} from '../../../core/api';

export const loadShopkeeperSales = createAction(
  '[ShopkeeperSales] Load ShopkeeperSales',
  props<{
    filters?: { orderNumber?: string; productName?: string; date?: string; shopName?: string };
  }>(),
);

export const loadShopkeeperSalesSuccess = createAction(
  '[ShopkeeperSales] Load ShopkeeperSales Success',
  props<{ shopkeeperSales: ShopkeeperSale[] }>(),
);

export const loadShopkeeperSalesFailure = createAction(
  '[ShopkeeperSales] Load ShopkeeperSales Failure',
  props<{ error: string }>(),
);

export const selectShopkeeperSale = createAction(
  '[ShopkeeperSales] Select ShopkeeperSale',
  props<{ shopkeeperSaleId: number | null }>(),
);

export const getShopkeeperSale = createAction(
  '[ShopkeeperSales] Get ShopkeeperSale',
  props<{ shopkeeperSaleId: number }>(),
);

export const getShopkeeperSaleSuccess = createAction(
  '[ShopkeeperSales] Get ShopkeeperSale Success',
  props<{ shopkeeperSale: ShopkeeperSale }>(),
);

export const getShopkeeperSaleFailure = createAction(
  '[ShopkeeperSales] Get ShopkeeperSale Failure',
  props<{ error: string }>(),
);

export const createShopkeeperSale = createAction(
  '[ShopkeeperSales] Create ShopkeeperSale',
  props<{ data: ShopkeeperSaleCreateDto }>(),
);

export const createShopkeeperSaleSuccess = createAction(
  '[ShopkeeperSales] Create ShopkeeperSale Success',
  props<{ shopkeeperSale: ShopkeeperSale }>(),
);

export const createShopkeeperSaleFailure = createAction(
  '[ShopkeeperSales] Create ShopkeeperSale Failure',
  props<{ error: string }>(),
);

export const updateShopkeeperSale = createAction(
  '[ShopkeeperSales] Update ShopkeeperSale',
  props<{ shopkeeperSaleId: number; data: ShopkeeperSaleUpdateDto }>(),
);

export const updateShopkeeperSaleSuccess = createAction(
  '[ShopkeeperSales] Update ShopkeeperSale Success',
  props<{ shopkeeperSaleId: number; shopkeeperSale: ShopkeeperSale }>(),
);

export const updateShopkeeperSaleFailure = createAction(
  '[ShopkeeperSales] Update ShopkeeperSale Failure',
  props<{ error: string }>(),
); 