import { createReducer, on } from '@ngrx/store';
import { Address } from '../../../core/api/model/address';
import * as AddressesActions from '../actions/addresses.actions';

export const addressesFeatureKey = 'addresses';

export interface AddressState {
  list: Address[];
  selectedAddressId: number | null;
}

export const initialState: AddressState = {
  list: [],
  selectedAddressId: null,
};

export const reducer = createReducer(
  initialState,
  on(
    AddressesActions.loadAddressesSuccess,
    (state, { addresses }): AddressState => ({
      ...state,
      list: addresses,
    }),
  ),
  on(
    AddressesActions.selectAddress,
    (state, { addressId }): AddressState => ({
      ...state,
      selectedAddressId: addressId,
    }),
  ),
  on(
    AddressesActions.getAddressSuccess,
    (state, { address }): AddressState => ({
      ...state,
      list: state.list.map((a) => (a.id === address.id ? address : a)),
    }),
  ),
  on(
    AddressesActions.createAddressSuccess,
    (state, { address }): AddressState => ({
      ...state,
      list: [...state.list, address],
    }),
  ),
  on(
    AddressesActions.updateAddressSuccess,
    (state, { addressId, address }): AddressState => ({
      ...state,
      list: state.list.map((a) => (a.id === addressId ? address : a)),
    }),
  ),
  on(
    AddressesActions.deleteAddressSuccess,
    (state, { addressId }): AddressState => ({
      ...state,
      list: state.list.filter(a => a.id !== addressId),
      selectedAddressId: state.selectedAddressId === addressId ? null : state.selectedAddressId,
    }),
  ),
); 