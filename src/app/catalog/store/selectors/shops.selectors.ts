import { createSelector } from '@ngrx/store';
import { selectCatalogState } from './index';
import * as fromShops from '../reducers/shops.reducer';

export const selectShopsState = createSelector(
  selectCatalogState,
  (state) => state[fromShops.shopsFeatureKey],
);

export const selectShopsList = createSelector(
  selectShopsState,
  (state) => state.list,
);

export const selectSelectedShopId = createSelector(
  selectShopsState,
  (state) => state.selectedShopId,
);

export const selectSelectedShop = createSelector(
  selectShopsList,
  selectSelectedShopId,
  (shops, selectedShopId) => shops.find((c) => c.id === selectedShopId) ?? null,
);
