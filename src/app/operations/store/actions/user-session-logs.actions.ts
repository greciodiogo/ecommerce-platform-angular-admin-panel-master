import { createAction, props } from '@ngrx/store';
import { OperationLog } from '../../model/operation-log.model';

export const loadUserSessionLogs = createAction('[UserSessionLogs] Load User Session Logs');
export const loadUserSessionLogsSuccess = createAction('[UserSessionLogs] Load User Session Logs Success', props<{ logs: OperationLog[] }>());
export const loadUserSessionLogsFailure = createAction('[UserSessionLogs] Load User Session Logs Failure', props<{ error: string }>()); 