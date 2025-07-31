import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PromotionsApiService } from '../../../core/api/api/promotions-api.service';
import * as PromotionsActions from '../actions/promotions.actions';
import { exhaustMap, map, catchError, debounceTime, filter } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PromotionsEffects {
  private lastPromotionId: number | null = null;
  private lastProductsUpdate = 0;
  
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
      filter(action => {
        // Evita requisições duplicadas para a mesma promoção
        if (this.lastPromotionId === action.promotionId) {
          return false;
        }
        this.lastPromotionId = action.promotionId;
        return true;
      }),
      debounceTime(300), // Adiciona um delay para evitar múltiplas chamadas
      exhaustMap(({ promotionId }) => {
        return this.promotionsApi.getPromotion(promotionId).pipe(
          map((promotion) => PromotionsActions.getPromotionSuccess({ promotion })),
          catchError((error) => {
            console.error('Error fetching promotion:', error);
            return of(PromotionsActions.getPromotionFailure({ 
              error: error.message || 'Failed to fetch promotion' 
            }));
          })
        );
      })
    )
  );

  // Effect para buscar produtos apenas quando necessário
  getPromotionProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.getPromotionSuccess),
      filter(() => {
        const now = Date.now();
        // Permite atualização apenas a cada 5 segundos
        if (now - this.lastProductsUpdate < 5000) {
          return false;
        }
        this.lastProductsUpdate = now;
        return true;
      }),
      debounceTime(300),
      exhaustMap(({ promotion }) => {
        return this.promotionsApi.getPromotionProducts(promotion.id).pipe(
          map((products) => ({ type: '[Promotions] Load Products Success', products })),
          catchError((error) => of({ 
            type: '[Promotions] Load Products Failure', 
            error: error.message || 'Failed to load products' 
          }))
        );
      })
    )
  );
}
