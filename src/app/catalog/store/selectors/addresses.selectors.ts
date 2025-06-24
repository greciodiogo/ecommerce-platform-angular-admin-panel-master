import { createSelector } from '@ngrx/store';
import * as fromAddresses from '../reducers/addresses.reducer';
import { selectCatalogState } from './index';

export const selectAddressesState = createSelector(
  selectCatalogState,
  (state) => state[fromAddresses.addressesFeatureKey],
);

export const selectAddressesList = createSelector(
  selectAddressesState,
  (state) => state.list,
);

export const selectSelectedAddressId = createSelector(
  selectAddressesState,
  (state) => state.selectedAddressId,
);

export const selectSelectedAddress = createSelector(
  selectAddressesList,
  selectSelectedAddressId,
  (addresses, selectedAddressId) => {
    return addresses.find((a) => a.id === selectedAddressId) ?? null;
  },
); 