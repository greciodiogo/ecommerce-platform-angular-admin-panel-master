import { createSelector } from '@ngrx/store';
import * as fromShopkeeperSales from '../reducers/shopkeepersales.reducer';
import { selectSalesState } from './index';
import { ShopkeeperSale } from '../../../core/api';

export const selectShopkeeperSalesState = createSelector(
  selectSalesState,
  (state) => state[fromShopkeeperSales.shopkeeperSalesFeatureKey],
);

export const selectShopkeeperSalesList = createSelector(
  selectShopkeeperSalesState,
  (state) => state.list,
);

export const selectSelectedShopkeeperSaleId = createSelector(
  selectShopkeeperSalesState,
  (state) => state.selectedShopkeeperSaleId,
);

export const selectSelectedShopkeeperSale = createSelector(
  selectShopkeeperSalesState,
  selectSelectedShopkeeperSaleId,
  (state, selectedShopkeeperSaleId) => {
    return selectedShopkeeperSaleId
      ? state.list.find((s) => s.id === selectedShopkeeperSaleId)
      : null;
  },
); 