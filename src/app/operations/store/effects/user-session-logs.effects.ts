import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OperationLogsApiService } from '../../../core/api/api/operation-logs-api.service';
import * as UserSessionLogsActions from '../actions/user-session-logs.actions';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { OperationLog } from '../../model/operation-log.model';

function sortLogsByTimestampDesc(logs: OperationLog[]): OperationLog[] {
  return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

@Injectable()
export class UserSessionLogsEffects {
  constructor(
    private actions$: Actions,
    private logsApi: OperationLogsApiService,
  ) {}

  loadUserSessionLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserSessionLogsActions.loadUserSessionLogs),
      exhaustMap(() =>
        this.logsApi.getUserSessionLogs().pipe(
          map((logs) => UserSessionLogsActions.loadUserSessionLogsSuccess({ logs: sortLogsByTimestampDesc(logs) })),
          catchError((error) => of(UserSessionLogsActions.loadUserSessionLogsFailure({ error: error.message })))
        )
      )
    )
  );
} 