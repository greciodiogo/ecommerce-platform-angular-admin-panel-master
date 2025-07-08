import { createReducer, on } from '@ngrx/store';
import { OperationLog } from '../../model/operation-log.model';
import { OperationsActions } from '../actions';

export const logsFeatureKey = 'logs';

export interface State {
  list: OperationLog[];
}

export const initialState: State = {
  list: [],
};

export const reducer = createReducer(
  initialState,
  on(OperationsActions.loadLogsSuccess, (state, { logs }) => ({ ...state, list: logs })),
  on(OperationsActions.deleteLogSuccess, (state, { id }) => ({ ...state, list: state.list.filter(log => log.id !== id) })),
); 