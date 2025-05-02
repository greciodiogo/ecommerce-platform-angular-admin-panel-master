import { createReducer, on } from '@ngrx/store';
import { DashboardActions } from '../actions';
import { DashboardState } from 'src/app/core/api';


export const dashboardFeatureKey = 'dashboard';


export interface State {
  dashboard: DashboardState;
}

export const initialState: State = {
  dashboard: {
    confirmedToday: 0,
    confirmedOrderWeek: 0,
    completedDeliveriesWeek: 0,
    newUsers: 0,
    totalSales: 0
  },
};

export const reducer = createReducer(
  initialState,
  on(DashboardActions.loadDashboardSuccess, (state, { dashboard }) => {
    console.log('Atualizando estado do Dashboard:', dashboard);  // Verificando os dados no reducer
    return {
      ...state,
      dashboard: { ...dashboard },  // Atualizando a parte específica do estado
    };
  }),
);
