import { createAction, props } from '@ngrx/store';
import { Notification, CreateNotificationDto } from '../../../core/api';

export const loadNotifications = createAction('[Notifications] Load Notifications');

export const loadNotificationsSuccess = createAction(
  '[Notifications] Load Notifications Success',
  props<{ notifications: Notification[] }>(),
);

export const loadNotificationsFailure = createAction(
  '[Notifications] Load Notifications Failure',
  props<{ error: string }>(),
);

export const selectNotification = createAction(
  '[Notifications] Select Notification',
  props<{ notificationId: number | null }>(),
);

export const addNotification = createAction(
  '[Notifications] Add Notification',
  props<{ data: CreateNotificationDto }>(),
);

export const addNotificationSuccess = createAction(
  '[Notifications] Add Notification Success',
  props<{ notification: Notification }>(),
);

export const addNotificationFailure = createAction(
  '[Notifications] Add Notification Failure',
  props<{ error: string }>(),
);

// export const updateNotification = createAction(
//   '[Notifications] Update Notification',
//   props<{ id: number; data: NotificationUpdateDto }>(),
// );

// export const updateNotificationSuccess = createAction(
//   '[Notifications] Update Notification Success',
//   props<{ id: number; notification: Notification }>(),
// );

export const updateNotificationFailure = createAction(
  '[Notifications] Update Notification Failure',
  props<{ error: string }>(),
);

export const deleteNotification = createAction(
  '[Notifications] Delete Notification',
  props<{ id: number }>(),
);

export const deleteNotificationSuccess = createAction(
  '[Notifications] Delete Notification Success',
  props<{ id: number }>(),
);

export const deleteNotificationFailure = createAction(
  '[Notifications] Delete Notification Failure',
  props<{ error: string }>(),
);
