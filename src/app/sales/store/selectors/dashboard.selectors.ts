import { createSelector } from '@ngrx/store';
import * as fromDashboard from '../reducers/dashboard.reducer';
import { selectSalesState } from '.';

export const selectDashboardState = createSelector(
  selectSalesState,
  (state) => state[fromDashboard.dashboardFeatureKey],
);

export const selectDashboardItems = createSelector(
  selectDashboardState,
  (state) => state.dashboard,
);