import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PromotionsApiService } from '../../../core/api/api/promotions-api.service';
import * as PromotionsActions from '../actions/promotions.actions';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PromotionsEffects {
  constructor(private actions$: Actions, private promotionsApi: PromotionsApiService) {}

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

  getPromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.getPromotion),
      exhaustMap(({ promotionId }) =>
        this.promotionsApi.getPromotion(promotionId).pipe(
          map((promotion) => PromotionsActions.getPromotionSuccess({ promotion })),
          catchError(({ error }) =>
            of(PromotionsActions.getPromotionFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

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