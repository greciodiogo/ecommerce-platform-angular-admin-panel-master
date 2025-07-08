import { createAction, props } from '@ngrx/store';
import { OperationLog } from '../../model/operation-log.model';

export const loadLogs = createAction('[Operations] Load Logs');
export const loadLogsSuccess = createAction('[Operations] Load Logs Success', props<{ logs: OperationLog[] }>());
export const loadLogsFailure = createAction('[Operations] Load Logs Failure', props<{ error: string }>());

export const deleteLog = createAction('[Operations] Delete Log', props<{ id: number }>());
export const deleteLogSuccess = createAction('[Operations] Delete Log Success', props<{ id: number }>());
export const deleteLogFailure = createAction('[Operations] Delete Log Failure', props<{ error: string }>()); 