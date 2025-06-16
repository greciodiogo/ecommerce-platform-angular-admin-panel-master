import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesActions, NotificationsActions } from '../actions';
import { NotificationsApiService } from '../../../core/api';
import { concatMap, exhaustMap, map } from 'rxjs/operators';
import { catchError, of } from 'rxjs';

@Injectable()
export class NotificationsEffects {
  constructor(private actions$: Actions, private notificationsApi: NotificationsApiService) {}

  loadNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationsActions.loadNotifications),
      exhaustMap(() =>
        this.notificationsApi.findAllNotificationsMe().pipe(
          map((notifications) => NotificationsActions.loadNotificationsSuccess({ notifications })),
          catchError(({ error }) =>
            of(NotificationsActions.loadNotificationsFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  addNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationsActions.addNotification),
      concatMap(({ data }) =>
        this.notificationsApi.createNotification(data).pipe(
          map((notification) => NotificationsActions.addNotificationSuccess({ notification })),
          catchError(({ error }) =>
            of(NotificationsActions.addNotificationFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

//   updateNotification$ = createEffect(() => {
//     return this.actions$.pipe(
//       ofType(NotificationsActions.updateNotification),
//       concatMap(({ id, data }) =>
//         this.notificationsApi.updateNotification(id, data).pipe(
//           map((notification) => NotificationsActions.updateNotificationSuccess({ id, notification })),
//           catchError(({ error }) =>
//             of(NotificationsActions.updateNotificationFailure({ error: error.message })),
//           ),
//         ),
//       ),
//     );
//   });

//   deleteNotification$ = createEffect(() => {
//     return this.actions$.pipe(
//       ofType(NotificationsActions.deleteNotification),
//       concatMap(({ id }) =>
//         this.notificationsApi.deleteNotification(id).pipe(
//           map(() => NotificationsActions.deleteNotificationSuccess({ id })),
//           catchError(({ error }) =>
//             of(NotificationsActions.deleteNotificationFailure({ error: error.message })),
//           ),
//         ),
//       ),
//     );
//   });
}
