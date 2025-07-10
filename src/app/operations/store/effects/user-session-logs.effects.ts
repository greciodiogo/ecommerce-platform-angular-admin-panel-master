import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OperationLogsApiService } from '../../../core/api/api/operation-logs-api.service';
import * as UserSessionLogsActions from '../actions/user-session-logs.actions';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { OperationLog } from '../../model/operation-log.model';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

function sortLogsByTimestampDesc(logs: OperationLog[]): OperationLog[] {
  return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

@Injectable()
export class UserSessionLogsEffects {
  constructor(
    private actions$: Actions,
    private logsApi: OperationLogsApiService,
  ) {}

  loadUserSessionLogs$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UserSessionLogsActions.loadUserSessionLogs),
      exhaustMap(() =>
        this.logsApi.getUserSessions().pipe(
          map((logs) => UserSessionLogsActions.loadUserSessionLogsSuccess({ logs: sortLogsByTimestampDesc(logs) })),
          catchError((error) => of(UserSessionLogsActions.loadUserSessionLogsFailure({ error: error.message })))
        )
      )
    )
  );
} 