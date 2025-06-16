import { createSelector } from '@ngrx/store';
import { selectCatalogState } from './index';
import * as fromNotifications from '../reducers/notifications.reducer';

export const selectNotificationsState = createSelector(
  selectCatalogState,
  (state) => state[fromNotifications.notificationsFeatureKey],
);

export const selectNotificationsList = createSelector(
  selectNotificationsState,
  (state) => state.list,
);

export const selectSelectedNotificationId = createSelector(
  selectNotificationsState,
  (state) => state.selectedNotificationId,
);

export const selectSelectedNotification = createSelector(
  selectNotificationsList,
  selectSelectedNotificationId,
  (faqs, selectedNotificationId) => faqs.find((c) => c.id === selectedNotificationId) ?? null,
);
