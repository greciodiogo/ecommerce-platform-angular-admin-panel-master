import { createReducer, on } from '@ngrx/store';
import { ShopkeeperSale } from '../../../core/api';
import { ShopkeeperSalesActions } from '../actions';

export const shopkeeperSalesFeatureKey = 'shopkeeperSales';

export interface State {
  list: ShopkeeperSale[];
  selectedShopkeeperSaleId: number | null;
}

export const initialState: State = {
  list: [],
  selectedShopkeeperSaleId: null,
};

export const reducer = createReducer(
  initialState,
  on(
    ShopkeeperSalesActions.loadShopkeeperSalesSuccess,
    (state, { shopkeeperSales }): State => ({
      ...state,
      list: shopkeeperSales,
    }),
  ),
  on(
    ShopkeeperSalesActions.selectShopkeeperSale,
    (state, { shopkeeperSaleId }): State => ({
      ...state,
      selectedShopkeeperSaleId: shopkeeperSaleId,
    }),
  ),
  on(
    ShopkeeperSalesActions.getShopkeeperSaleSuccess,
    (state, { shopkeeperSale }): State => ({
      ...state,
      list: state.list.map((s) => (s.id === shopkeeperSale.id ? shopkeeperSale : s)),
    }),
  ),
  on(
    ShopkeeperSalesActions.createShopkeeperSaleSuccess,
    (state, { shopkeeperSale }): State => ({
      ...state,
      list: [...state.list, shopkeeperSale],
    }),
  ),
  on(
    ShopkeeperSalesActions.updateShopkeeperSaleSuccess,
    (state, { shopkeeperSaleId, shopkeeperSale }): State => ({
      ...state,
      list: state.list.map((s) => (s.id === shopkeeperSaleId ? shopkeeperSale : s)),
    }),
  ),
); 