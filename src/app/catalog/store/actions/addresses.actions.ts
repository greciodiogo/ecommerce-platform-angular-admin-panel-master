import { createAction, props } from '@ngrx/store';
import { Address } from '../../../core/api/model/address';
import { CreateAddressDto } from '../../../core/api/model/create-address-dto';
import { UpdateAddressDto } from '../../../core/api/model/update-address-dto';

export const loadAddresses = createAction('[Addresses] Load Addresses');

export const loadAddressesSuccess = createAction(
  '[Addresses] Load Addresses Success',
  props<{ addresses: Address[] }>(),
);

export const loadAddressesFailure = createAction(
  '[Addresses] Load Addresses Failure',
  props<{ error: string }>(),
);

export const selectAddress = createAction(
  '[Addresses] Select Address',
  props<{ addressId: number | null }>(),
);

export const getAddress = createAction(
  '[Addresses] Get Address',
  props<{ addressId: number }>(),
);

export const getAddressSuccess = createAction(
  '[Addresses] Get Address Success',
  props<{ address: Address }>(),
);

export const getAddressFailure = createAction(
  '[Addresses] Get Address Failure',
  props<{ error: string }>(),
);

export const createAddress = createAction(
  '[Addresses] Create Address',
  props<{ data: CreateAddressDto }>(),
);

export const createAddressSuccess = createAction(
  '[Addresses] Create Address Success',
  props<{ address: Address }>(),
);

export const createAddressFailure = createAction(
  '[Addresses] Create Address Failure',
  props<{ error: string }>(),
);

export const updateAddress = createAction(
  '[Addresses] Update Address',
  props<{ addressId: number; data: UpdateAddressDto }>(),
);

export const updateAddressSuccess = createAction(
  '[Addresses] Update Address Success',
  props<{ addressId: number; address: Address }>(),
);

export const updateAddressFailure = createAction(
  '[Addresses] Update Address Failure',
  props<{ error: string }>(),
);

export const deleteAddress = createAction(
  '[Addresses] Delete Address',
  props<{ addressId: number }>(),
);

export const deleteAddressSuccess = createAction(
  '[Addresses] Delete Address Success',
  props<{ addressId: number }>(),
);

export const deleteAddressFailure = createAction(
  '[Addresses] Delete Address Failure',
  props<{ error: string }>(),
); 