import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from './core/auth/store/actions';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store,
    private fcmService: FcmService
  ) {}

  ngOnInit() {
    this.store.dispatch(AuthActions.loginCheck());
    this.initializePushNotifications();
  }

  private initializePushNotifications() {
    // Check if push notifications are supported
    if (!this.fcmService.isSupported()) {
      console.log('Push notifications not supported in this browser');
      return;
    }

    // Request permission after user is logged in
    // You might want to do this after successful login instead
    setTimeout(() => {
      this.requestNotificationPermission();
    }, 2000);

    // Listen to foreground messages
    this.fcmService.listenToMessages((payload) => {
      console.log('Received foreground message:', payload);
      // You can dispatch an action to update the notification store here
      // this.store.dispatch(NotificationActions.addNotification(payload));
    });
  }

  private async requestNotificationPermission() {
    const permission = this.fcmService.getPermissionStatus();
    
    if (permission === 'default') {
      // Only request if not already decided
      const token = await this.fcmService.requestPermission();
      if (token) {
        console.log('Push notifications enabled');
      }
    } else if (permission === 'granted') {
      // Permission already granted, just get the token
      await this.fcmService.requestPermission();
    }
  }
}
