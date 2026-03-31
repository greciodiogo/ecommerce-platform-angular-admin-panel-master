import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private socket: Socket | null = null;
  public notifications$ = new BehaviorSubject<any[]>([]);
  public unreadCount$ = new BehaviorSubject<number>(0);
  private userId: number | null = null;

  constructor() {}

  connect(userId: number) {
    if (this.socket && this.userId === userId) {
      return; // Already connected
    }

    this.userId = userId;
    
    this.socket = io(environment.apiUrl, {
      query: { userId: userId.toString() },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected for notifications');
    });

    this.socket.on('notification', (notification: any) => {
      console.log('New notification received:', notification);
      this.notifications$.next([notification, ...this.notifications$.value]);
      this.unreadCount$.next(this.unreadCount$.value + 1);
      
      // Play notification sound
      this.playNotificationSound();
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  loadInitialNotifications(list: any[]) {
    this.notifications$.next(list);
    this.updateUnreadCount();
  }

  markAsRead(notificationId: number) {
    const notifications = this.notifications$.value;
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1 && !notifications[index].isRead) {
      notifications[index].isRead = true;
      this.notifications$.next([...notifications]);
      this.updateUnreadCount();
    }
  }

  markAllAsRead() {
    const notifications = this.notifications$.value.map(n => ({ ...n, isRead: true }));
    this.notifications$.next(notifications);
    this.unreadCount$.next(0);
  }

  removeNotification(notificationId: number) {
    const notifications = this.notifications$.value.filter(n => n.id !== notificationId);
    this.notifications$.next(notifications);
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const unread = this.notifications$.value.filter(n => !n.isRead).length;
    this.unreadCount$.next(unread);
  }

  private playNotificationSound() {
    try {
      const audio = new Audio('assets/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Could not play notification sound:', err));
    } catch (error) {
      console.log('Notification sound not available');
    }
  }
} 