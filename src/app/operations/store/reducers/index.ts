import * as fromLogs from './logs.reducer';
import * as fromUserSessionLogs from './user-session-logs.reducer';
import { Action, combineReducers } from '@ngrx/store';

export const operationsFeatureKey = 'operations';

export interface OperationsState {
  [fromLogs.logsFeatureKey]: fromLogs.State;
  [fromUserSessionLogs.userSessionLogsFeatureKey]: fromUserSessionLogs.State;
}

export function reducers(state: OperationsState | undefined, action: Action) {
  return combineReducers({
    [fromLogs.logsFeatureKey]: fromLogs.reducer,
    [fromUserSessionLogs.userSessionLogsFeatureKey]: fromUserSessionLogs.reducer,
  })(state, action);
} 