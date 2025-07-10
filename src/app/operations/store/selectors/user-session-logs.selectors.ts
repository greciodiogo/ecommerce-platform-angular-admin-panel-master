import { createSelector } from '@ngrx/store';
import * as fromUserSessionLogs from '../reducers/user-session-logs.reducer';
import { selectOperationsState } from './index';

export const selectUserSessionLogsState = createSelector(
  selectOperationsState,
  (state) => state[fromUserSessionLogs.userSessionLogsFeatureKey],
);

export const selectUserSessionLogsList = createSelector(
  selectUserSessionLogsState,
  (state) => state.list,
); 