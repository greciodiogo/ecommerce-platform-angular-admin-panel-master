import { createAction, props } from '@ngrx/store';
import { DashboardState } from '../../../core/api';

// Ação para carregar o dashboard
export const loadDashboard = createAction('[Dashboard] Load Dashboard');

// Ação de sucesso ao carregar o dashboard
export const loadDashboardSuccess = createAction(
  '[Dashboard] Load Dashboard Success',
  props<{ dashboard: DashboardState }>()
);

// Ação de falha ao carregar o dashboard
export const loadDashboardFailure = createAction(
  '[Dashboard] Load Dashboard Failure',
  props<{ error: string }>()
);
