import { createSelector } from '@ngrx/store';
import * as fromLogs from '../reducers/logs.reducer';
import { selectOperationsState } from './index';

export const selectLogsState = createSelector(
  selectOperationsState,
  (state) => state[fromLogs.logsFeatureKey],
);

export const selectLogsList = createSelector(
  selectLogsState,
  (state) => state.list,
); 