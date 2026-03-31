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
    // Filtrar apenas notificações não lidas
    const unreadNotifications = list.filter(n => !n.isRead);
    this.notifications$.next(unreadNotifications);
    this.updateUnreadCount();
  }

  markAsRead(notificationId: number) {
    const notifications = this.notifications$.value;
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1 && !notifications[index].isRead) {
      // Remover da lista em vez de marcar como lida
      notifications.splice(index, 1);
      this.notifications$.next([...notifications]);
      this.updateUnreadCount();
    }
  }

  markAllAsRead() {
    // Limpar todas as notificações da lista
    this.notifications$.next([]);
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
      // Tentar tocar arquivo MP3
      const audio = new Audio('assets/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Se falhar, usar Web Audio API para gerar um beep
        this.playBeep();
      });
    } catch (error) {
      // Fallback para beep gerado
      this.playBeep();
    }
  }

  private playBeep() {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequência em Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }
} 