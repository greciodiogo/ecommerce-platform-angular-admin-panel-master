import * as fromLogs from './logs.reducer';
import { Action, combineReducers } from '@ngrx/store';

export const operationsFeatureKey = 'operations';

export interface OperationsState {
  [fromLogs.logsFeatureKey]: fromLogs.State;
}

export function reducers(state: OperationsState | undefined, action: Action) {
  return combineReducers({
    [fromLogs.logsFeatureKey]: fromLogs.reducer,
  })(state, action);
} 