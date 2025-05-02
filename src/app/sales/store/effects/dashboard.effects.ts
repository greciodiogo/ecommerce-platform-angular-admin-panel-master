import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { DefaultApiService } from './../../../core/api/api/default-api.service';
import { DashboardActions } from '../actions';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private dashboardApi: DefaultApiService
  ) {}

  // Efeito para carregar o Dashboard
  loadDashboard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.loadDashboard), // Ação disparada para carregar o dashboard
      exhaustMap(() =>
        this.dashboardApi.getDashboard().pipe( // Chamada da API
          map((dashboard) => 
            DashboardActions.loadDashboardSuccess({ dashboard }) // Se a requisição for bem-sucedida
          ),
          catchError(({ error }) => 
            of(DashboardActions.loadDashboardFailure({ error: error.message })) // Se falhar
          )
        )
      )
    );
  });
}
