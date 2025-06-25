import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ShopkeepersalesApiService } from '../../../core/api';
import { ShopkeeperSalesActions } from '../actions';
import { exhaustMap, filter, map } from 'rxjs/operators';
import { catchError, of } from 'rxjs';

@Injectable()
export class ShopkeeperSalesEffects {
  constructor(
    private actions$: Actions,
    private shopkeeperSalesApi: ShopkeepersalesApiService,
  ) {}

  loadShopkeeperSales$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShopkeeperSalesActions.loadShopkeeperSales),
      exhaustMap((action) =>
        this.shopkeeperSalesApi.findAll().pipe(
          map((shopkeeperSales) =>
            ShopkeeperSalesActions.loadShopkeeperSalesSuccess({
              shopkeeperSales,
            }),
          ),
          catchError(({ error }) =>
            of(
              ShopkeeperSalesActions.loadShopkeeperSalesFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });

  getShopkeeperSale$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShopkeeperSalesActions.getShopkeeperSale),
      exhaustMap(({ shopkeeperSaleId }) =>
        this.shopkeeperSalesApi.findOne(shopkeeperSaleId).pipe(
          map((shopkeeperSale) =>
            ShopkeeperSalesActions.getShopkeeperSaleSuccess({ shopkeeperSale }),
          ),
          catchError(({ error }) =>
            of(
              ShopkeeperSalesActions.getShopkeeperSaleFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });

  selectShopkeeperSale$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShopkeeperSalesActions.selectShopkeeperSale),
      filter(({ shopkeeperSaleId }) => shopkeeperSaleId !== null),
      map(({ shopkeeperSaleId }) =>
        ShopkeeperSalesActions.getShopkeeperSale({ shopkeeperSaleId: shopkeeperSaleId as number }),
      ),
    );
  });

  createShopkeeperSale$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShopkeeperSalesActions.createShopkeeperSale),
      exhaustMap(({ data }) =>
        this.shopkeeperSalesApi.create(data).pipe(
          map((newShopkeeperSale) =>
            ShopkeeperSalesActions.createShopkeeperSaleSuccess({
              shopkeeperSale: newShopkeeperSale,
            }),
          ),
          catchError(({ error }) =>
            of(
              ShopkeeperSalesActions.createShopkeeperSaleFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });

  updateShopkeeperSale$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShopkeeperSalesActions.updateShopkeeperSale),
      exhaustMap(({ shopkeeperSaleId, data }) =>
        this.shopkeeperSalesApi.update(shopkeeperSaleId, data).pipe(
          map((updatedShopkeeperSale) =>
            ShopkeeperSalesActions.updateShopkeeperSaleSuccess({
              shopkeeperSaleId,
              shopkeeperSale: updatedShopkeeperSale,
            }),
          ),
          catchError(({ error }) =>
            of(
              ShopkeeperSalesActions.updateShopkeeperSaleFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });
} 