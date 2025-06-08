import { createReducer, on } from '@ngrx/store';
import { NotificationsActions } from '../actions';
import { Notification } from 'src/app/core/api';

export const notificationsFeatureKey = 'notifications';

export interface State {
  list: Notification[];
  selectedNotificationId: number | null;
}

export const initialState: State = {
  list: [],
  selectedNotificationId: null,
};

export const reducer = createReducer(
  initialState,
  on(
    NotificationsActions.loadNotificationsSuccess,
    (state, { notifications }): State => ({
      ...state,
      list: notifications,
    }),
  ),
  on(
    NotificationsActions.selectNotification,
    (state, { notificationId }): State => ({
      ...state,
      selectedNotificationId: notificationId,
    }),
  ),
  on(
    NotificationsActions.addNotificationSuccess,
    (state, { notification }): State => ({
      ...state,
      list: [...state.list, { ...notification }],
    }),
  ),
//   on(
//     NotificationsActions.updateNotificationSuccess,
//     (state, { id, notification }): State => ({
//       ...state,
//       list: state.list.map((p) => (p.id === id ? notification : p)),
//     }),
//   ),
  on(
    NotificationsActions.deleteNotificationSuccess,
    (state, { id }): State => ({
      ...state,
      list: state.list.filter((p) => p.id !== id),
    }),
  ),
);
