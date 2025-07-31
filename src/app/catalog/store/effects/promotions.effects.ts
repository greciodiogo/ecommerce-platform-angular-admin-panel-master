import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PromotionsApiService } from '../../../core/api/api/promotions-api.service';
import * as PromotionsActions from '../actions/promotions.actions';
import { exhaustMap, map, catchError, debounceTime, filter, distinctUntilChanged, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PromotionsEffects {
  private lastPromotionId: number | null = null;
  private lastProductsUpdate = 0;
  
  constructor(
    private actions$: Actions,
    private promotionsApi: PromotionsApiService,
    private store: Store
  ) {}

  loadPromotions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.loadPromotions),
      exhaustMap(() =>
        this.promotionsApi.getPromotions().pipe(
          map((promotions) => PromotionsActions.loadPromotionsSuccess({ promotions })),
          catchError(({ error }) =>
            of(PromotionsActions.loadPromotionsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

    getPromotion$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(PromotionsActions.getPromotion),
        exhaustMap(({ promotionId }) =>
          this.promotionsApi.getPromotion(promotionId).pipe(
            map((promotion) => PromotionsActions.getPromotionSuccess({ promotion })),
            catchError(({ error }) =>
              of(PromotionsActions.getPromotionFailure({ error: error.message })),
            ),
          ),
        ),
      );
    });

  // Effect separado para produtos que só executa uma vez por promoção
     getPromotionProducts$ = createEffect(() => {
       return this.actions$.pipe(
         ofType(PromotionsActions.getPromotionProducts),
         exhaustMap(({ id }) =>
           this.promotionsApi.getPromotionProducts(id).pipe(
             map((products) =>
               PromotionsActions.getPromotionProductsSuccess({
                 PromotionId: id,
                 products,
               }),
             ),
             catchError(({ error }) =>
               of(
                 PromotionsActions.getPromotionProductsFailure({
                   error: error.message,
                 }),
               ),
             ),
           ),
         ),
       );
     });

  createPromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.createPromotion),
      exhaustMap(({ data }) =>
        this.promotionsApi.createPromotion(data).pipe(
          map((promotion) => PromotionsActions.createPromotionSuccess({ promotion })),
          catchError(({ error }) =>
            of(PromotionsActions.createPromotionFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  addPromotionProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.addPromotionProduct),
      distinctUntilChanged((prev, curr) => 
        prev.promotionId === curr.promotionId && prev.productId === curr.productId
      ),
      debounceTime(300),
      switchMap(({ promotionId, productId }) =>
        this.promotionsApi.addPromotionProduct(promotionId, { productId }).pipe(
          map((addedProduct) => 
            PromotionsActions.addPromotionProductSuccess({ 
              promotionId, 
              product: addedProduct 
            })
          ),
          catchError(({ error }) =>
            of(PromotionsActions.addPromotionProductFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  deletePromotionProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.deletePromotionProduct),
      exhaustMap(({ promotionId, productId }) =>
        this.promotionsApi.deletePromotionProduct(promotionId, productId).pipe(
          map(() => 
            PromotionsActions.deletePromotionProductSuccess({ 
              promotionId, 
              productId 
            })
          ),
          catchError(({ error }) =>
            of(PromotionsActions.deletePromotionProductFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  updatePromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.updatePromotion),
      exhaustMap(({ promotionId, data }) =>
        this.promotionsApi.updatePromotion(promotionId, data).pipe(
          map((promotion) =>
            PromotionsActions.updatePromotionSuccess({ promotionId, promotion }),
          ),
          catchError(({ error }) =>
            of(PromotionsActions.updatePromotionFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
} 