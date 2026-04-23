import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PromotionsApiService } from '../../../core/api/api/promotions-api.service';
import * as PromotionsActions from '../actions/promotions.actions';
import { exhaustMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class PromotionsEffects {
  constructor(
    private actions$: Actions,
    private promotionsApi: PromotionsApiService,
    private snackBar: MatSnackBar,
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

  addPromotionProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.addPromotionProduct),
      exhaustMap(({ promotionId, productId }) =>
        this.promotionsApi.addPromotionProduct(promotionId, { productId }).pipe(
          map(() => PromotionsActions.addPromotionProductSuccess({ promotionId })),
          catchError((error) => {
            const statusCode = error.status;
            const message = error.error?.message || 'Erro ao adicionar produto';
            
            return of(
              PromotionsActions.addPromotionProductFailure({
                error: message,
                statusCode,
              })
            );
          }),
        ),
      ),
    ),
  );

  addPromotionProductSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.addPromotionProductSuccess),
      tap(() => {
        this.snackBar.open('Produto adicionado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      }),
      map(({ promotionId }) => PromotionsActions.getPromotion({ promotionId })),
    ),
  );

  addPromotionProductFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.addPromotionProductFailure),
        tap(({ error, statusCode }) => {
          let message = error;
          
          if (statusCode === 409) {
            message = 'Este produto já está em outra promoção ativa. Remova-o da outra promoção primeiro.';
          }
          
          this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        }),
      ),
    { dispatch: false }
  );

  removePromotionProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.removePromotionProduct),
      exhaustMap(({ promotionId, productId }) =>
        this.promotionsApi.deletePromotionProduct(promotionId, productId).pipe(
          map(() => PromotionsActions.removePromotionProductSuccess({ promotionId })),
          catchError((error) => {
            const message = error.error?.message || 'Erro ao remover produto';
            return of(PromotionsActions.removePromotionProductFailure({ error: message }));
          }),
        ),
      ),
    ),
  );

  removePromotionProductSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.removePromotionProductSuccess),
      tap(() => {
        this.snackBar.open('Produto removido com sucesso!', 'Fechar', {
          duration: 3000,
        });
      }),
      map(({ promotionId }) => PromotionsActions.getPromotion({ promotionId })),
    ),
  );

  removePromotionProductFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.removePromotionProductFailure),
        tap(({ error }) => {
          this.snackBar.open(error, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        }),
      ),
    { dispatch: false }
  );
} 