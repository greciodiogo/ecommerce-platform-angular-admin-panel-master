import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AddressApiService } from '../../../core/api/api/address-api.service';
import * as AddressesActions from '../actions/addresses.actions';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AddressesEffects {
  constructor(private actions$: Actions, private addressApi: AddressApiService) {}

  loadAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressesActions.loadAddresses),
      exhaustMap(() =>
        this.addressApi.getAddresses().pipe(
          map((addresses) => AddressesActions.loadAddressesSuccess({ addresses })),
          catchError(({ error }) =>
            of(AddressesActions.loadAddressesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  getAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressesActions.getAddress),
      exhaustMap(({ addressId }) =>
        this.addressApi.getAddress(addressId).pipe(
          map((address) => AddressesActions.getAddressSuccess({ address })),
          catchError(({ error }) =>
            of(AddressesActions.getAddressFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  createAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressesActions.createAddress),
      exhaustMap(({ data }) =>
        this.addressApi.createAddress(data).pipe(
          map((address) => AddressesActions.createAddressSuccess({ address })),
          catchError(({ error }) =>
            of(AddressesActions.createAddressFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  updateAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressesActions.updateAddress),
      exhaustMap(({ addressId, data }) =>
        this.addressApi.updateAddress(addressId, data).pipe(
          map((address) =>
            AddressesActions.updateAddressSuccess({ addressId, address }),
          ),
          catchError(({ error }) =>
            of(AddressesActions.updateAddressFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  deleteAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressesActions.deleteAddress),
      exhaustMap(({ addressId }) =>
        this.addressApi.deleteAddress(addressId).pipe(
          map(() => AddressesActions.deleteAddressSuccess({ addressId })),
          catchError(({ error }) =>
            of(AddressesActions.deleteAddressFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
} 