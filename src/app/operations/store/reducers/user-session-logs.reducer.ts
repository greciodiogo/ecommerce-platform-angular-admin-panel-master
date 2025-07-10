import { createReducer, on } from '@ngrx/store';
import { OperationLog } from '../../model/operation-log.model';
import * as UserSessionLogsActions from '../actions/user-session-logs.actions';

export const userSessionLogsFeatureKey = 'userSessionLogs';

export interface State {
  list: OperationLog[];
}

export const initialState: State = {
  list: [],
};

export const reducer = createReducer(
  initialState,
  on(UserSessionLogsActions.loadUserSessionLogsSuccess, (state, { logs }) => ({ ...state, list: logs })),
); 