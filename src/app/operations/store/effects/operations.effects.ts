import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OperationLogsApiService } from '../../../core/api/api/operation-logs-api.service';
import { OperationsActions } from '../actions';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

function sortLogsByTimestampDesc(logs: any[]): any[] {
  return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

@Injectable()
export class OperationsEffects {
  constructor(
    private actions$: Actions,
    private logsApi: OperationLogsApiService,
  ) {}

  loadLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationsActions.loadLogs),
      exhaustMap(() =>
        this.logsApi.getAll().pipe(
          map((logs) => OperationsActions.loadLogsSuccess({ logs: sortLogsByTimestampDesc(logs) })),
          catchError((error) => of(OperationsActions.loadLogsFailure({ error: error.message })))
        )
      )
    )
  );

  deleteLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationsActions.deleteLog),
      exhaustMap(({ id }) =>
        this.logsApi._delete(id).pipe(
          map(() => OperationsActions.deleteLogSuccess({ id })),
          catchError((error) => of(OperationsActions.deleteLogFailure({ error: error.message })))
        )
      )
    )
  );
} 