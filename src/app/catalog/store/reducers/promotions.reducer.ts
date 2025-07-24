import { createReducer, on } from '@ngrx/store';
import { Promotion } from '../../../core/api/model/promotion';
import * as PromotionsActions from '../actions/promotions.actions';

export const promotionsFeatureKey = 'promotions';

export interface PromotionState {
  list: Promotion[];
  selectedPromotionId: number | null;
}

export const initialState: PromotionState = {
  list: [],
  selectedPromotionId: null,
};

export const reducer = createReducer(
  initialState,
  on(
    PromotionsActions.loadPromotionsSuccess,
    (state, { promotions }): PromotionState => ({
      ...state,
      list: promotions.map(p => ({ ...p, products: p.products || [] })),
    }),
  ),
  on(
    PromotionsActions.selectPromotion,
    (state, { promotionId }): PromotionState => ({
      ...state,
      selectedPromotionId: promotionId,
    }),
  ),
  on(
    PromotionsActions.getPromotionSuccess,
    (state, { promotion }): PromotionState => ({
      ...state,
      list: state.list.map((p) => {
        if (p.id === promotion.id) {
          // Se recebemos produtos novos, atualizamos apenas os produtos
          if (Array.isArray(promotion.products) && !promotion.name) {
            return {
              ...p,
              products: promotion.products
            };
          }
          // Se recebemos uma promoção completa, mantemos os produtos existentes se não houver novos
          return {
            ...promotion,
            products: Array.isArray(promotion.products) ? promotion.products : (p.products || [])
          };
        }
        return p;
      }),
    }),
  ),
  on(
    PromotionsActions.createPromotionSuccess,
    (state, { promotion }): PromotionState => ({
      ...state,
      list: [...state.list, { ...promotion, products: promotion.products || [] }],
    }),
  ),
  on(
    PromotionsActions.updatePromotionSuccess,
    (state, { promotionId, promotion }): PromotionState => ({
      ...state,
      list: state.list.map((p) => 
        p.id === promotionId 
          ? { ...promotion, products: promotion.products || [] }
          : p
      ),
    }),
  ),
  on(
    PromotionsActions.addPromotionProductSuccess,
    (state, { promotionId, product }): PromotionState => ({
      ...state,
      list: state.list.map((p) => {
        if (p.id === promotionId) {
          const existingProducts = p.products || [];
          // Verifica se o produto já existe
          if (existingProducts.some(ep => ep.id === product.id)) {
            return p;
          }
          return {
            ...p,
            products: [...existingProducts, product]
          };
        }
        return p;
      }),
    }),
  ),
  on(
    PromotionsActions.deletePromotionProductSuccess,
    (state, { promotionId, productId }): PromotionState => ({
      ...state,
      list: state.list.map((p) => {
        if (p.id === promotionId) {
          return {
            ...p,
            products: (p.products || []).filter(prod => prod.id !== productId)
          };
        }
        return p;
      }),
    }),
  ),
); 