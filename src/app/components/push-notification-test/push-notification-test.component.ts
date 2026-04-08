import { Component, OnInit } from '@angular/core';
import { FcmService } from '../../services/fcm.service';

@Component({
  selector: 'app-push-notification-test',
  template: `
    <div class="push-test-container">
      <h2>Push Notifications Test</h2>
      
      <div class="status">
        <p><strong>Status:</strong> {{ getStatusText() }}</p>
        <p><strong>Permission:</strong> {{ permission }}</p>
        <p *ngIf="fcmToken"><strong>FCM Token:</strong> {{ fcmToken.substring(0, 50) }}...</p>
      </div>

      <div class="actions">
        <button 
          mat-raised-button 
          color="primary" 
          (click)="requestPermission()"
          [disabled]="permission === 'granted'">
          {{ permission === 'granted' ? 'Permission Granted' : 'Request Permission' }}
        </button>

        <button 
          mat-raised-button 
          color="accent" 
          (click)="testNotification()"
          [disabled]="permission !== 'granted'">
          Test Notification
        </button>
      </div>

      <div class="info">
        <h3>Instructions:</h3>
        <ol>
          <li>Click "Request Permission" to enable push notifications</li>
          <li>Allow notifications when prompted by the browser</li>
          <li>Click "Test Notification" to send a test notification</li>
          <li>Check the browser console for logs</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .push-test-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .status {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }

    .status p {
      margin: 5px 0;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin: 20px 0;
    }

    .info {
      margin-top: 30px;
      padding: 15px;
      background: #e3f2fd;
      border-radius: 4px;
    }

    .info h3 {
      margin-top: 0;
    }

    .info ol {
      margin: 10px 0;
      padding-left: 20px;
    }
  `]
})
export class PushNotificationTestComponent implements OnInit {
  permission: NotificationPermission = 'default';
  fcmToken: string | null = null;

  constructor(private fcmService: FcmService) {}

  ngOnInit() {
    this.permission = this.fcmService.getPermissionStatus();
    
    // Listen to messages
    this.fcmService.listenToMessages((payload) => {
      console.log('Received message in test component:', payload);
      alert(`Received: ${payload.notification?.title}`);
    });
  }

  async requestPermission() {
    if (!this.fcmService.isSupported()) {
      alert('Push notifications are not supported in this browser');
      return;
    }

    const token = await this.fcmService.requestPermission();
    
    if (token) {
      this.fcmToken = token;
      this.permission = 'granted';
      alert('Permission granted! Token registered.');
    } else {
      alert('Permission denied or error occurred');
    }
  }

  testNotification() {
    if (this.permission !== 'granted') {
      alert('Please grant permission first');
      return;
    }

    // Show a local notification for testing
    if ('Notification' in window) {
      new Notification('Test Notification', {
        body: 'This is a test notification from the app',
        icon: '/assets/logo.png',
        badge: '/assets/logo.png'
      });
    }
  }

  getStatusText(): string {
    if (!this.fcmService.isSupported()) {
      return '❌ Not Supported';
    }
    
    switch (this.permission) {
      case 'granted':
        return '✅ Enabled';
      case 'denied':
        return '❌ Denied';
      default:
        return '⚠️ Not Requested';
    }
  }
}
