import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesActions, ShopsActions } from '../actions';
import { ShopsApiService } from '../../../core/api';
import { concatMap, exhaustMap, map } from 'rxjs/operators';
import { catchError, of } from 'rxjs';

@Injectable()
export class ShopsEffects {
  constructor(private actions$: Actions, private shopsApi: ShopsApiService) {}

  loadShops$ = createEffect(() => {
    console.log('teste on load effect');
    return this.actions$.pipe(
      ofType(ShopsActions.loadShops, CategoriesActions.loadCategories),
      exhaustMap(() =>
        this.shopsApi.getShops().pipe(
          map((shops) => ShopsActions.loadShopsSuccess({ shops })),
          catchError(({ error }) =>
            of(ShopsActions.loadShopsFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  addShop$ = createEffect(() => {
    console.log("on effects")
    return this.actions$.pipe(
      ofType(ShopsActions.addShop),
      concatMap(({ data }) =>
        this.shopsApi.createShop(data).pipe(
          map((shop) => ShopsActions.addShopSuccess({ shop })),
          catchError(({ error }) =>
            of(ShopsActions.addShopFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  updateShop$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShopsActions.updateShop),
      concatMap(({ id, data }) =>
        this.shopsApi.updateShop(id, data).pipe(
          map((shop) => ShopsActions.updateShopSuccess({ id, shop })),
          catchError(({ error }) =>
            of(ShopsActions.updateShopFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  // deleteShop$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(ShopsActions.deleteShop),
  //     concatMap(({ id }) =>
  //       this.shopsApi.deleteShop(id).pipe(
  //         map(() => ShopsActions.deleteShopSuccess({ id })),
  //         catchError(({ error }) =>
  //           of(ShopsActions.deleteShopFailure({ error: error.message })),
  //         ),
  //       ),
  //     ),
  //   );
  // });
}
