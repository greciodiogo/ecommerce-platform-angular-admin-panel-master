import { createReducer, on } from '@ngrx/store';
import { ShopsActions } from '../actions';
import { Shop } from 'src/app/core/api';

export const shopsFeatureKey = 'shops';

export interface State {
  list: Shop[];
  selectedShopId: number | null;
}

export const initialState: State = {
  list: [],
  selectedShopId: null,
};

export const reducer = createReducer(
  initialState,
  on(
    ShopsActions.loadShopsSuccess,
    (state, { shops }): State => ({
      ...state,
      list: shops,
    }),
  ),
  on(
    ShopsActions.selectShop,
    (state, { shopId }): State => ({
      ...state,
      selectedShopId: shopId,
    }),
  ),
  on(
    ShopsActions.addShopSuccess,
    (state, { shop }): State => ({
      ...state,
      list: [...state.list, { ...shop }],
    }),
  ),
  on(
    ShopsActions.updateShopSuccess,
    (state, { id, shop }): State => ({
      ...state,
      list: state.list.map((p) => (p.id === id ? shop : p)),
    }),
  ),
  on(
    ShopsActions.deleteShopSuccess,
    (state, { id }): State => ({
      ...state,
      list: state.list.filter((p) => p.id !== id),
    }),
  ),
);
