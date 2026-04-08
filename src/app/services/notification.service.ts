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
    
    console.log('🔌 Connecting to notifications with userId:', userId);
    console.log('🌐 API URL:', environment.apiUrl);
    
    // Configuração otimizada para Railway + Vercel
    // Usar apenas polling porque Railway pode não suportar WebSocket upgrade
    this.socket = io(environment.apiUrl, {
      path: '/socket.io/', // Path explícito
      query: { userId: userId.toString() },
      transports: ['polling'], // Apenas polling para Railway
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 20000,
      autoConnect: true,
      forceNew: false,
      upgrade: false, // Desabilitar upgrade para WebSocket
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected successfully!');
      console.log('📡 Transport:', this.socket?.io.engine.transport.name);
      console.log('🆔 Socket ID:', this.socket?.id);
    });

    this.socket.on('notification', (notification: any) => {
      console.log('🔔 New notification received:', notification);
      this.notifications$.next([notification, ...this.notifications$.value]);
      this.unreadCount$.next(this.unreadCount$.value + 1);
      
      // Show browser notification
      this.showBrowserNotification(notification);
      
      // Play notification sound
      this.playNotificationSound();
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Socket.IO disconnected:', reason);
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('🚫 Socket.IO connection error:', error.message);
      console.error('💡 Tip: Check if backend is running and CORS is configured');
    });

    this.socket.on('error', (error: any) => {
      console.error('⚠️ Socket.IO error:', error);
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

  private showBrowserNotification(notification: any) {
    // Check if browser supports notifications and permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = notification.title || 'Nova Notificação';
      const options = {
        body: notification.message || '',
        icon: '/assets/logo.png',
        badge: '/assets/logo.png',
        tag: notification.id?.toString() || 'notification',
        requireInteraction: false,
        data: {
          id: notification.id,
          actionUrl: notification.actionUrl,
          type: notification.type,
        }
      };

      const browserNotification = new Notification(title, options);

      // Handle notification click
      browserNotification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // Navigate to action URL if provided
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        
        browserNotification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    } else if ('Notification' in window && Notification.permission === 'default') {
      // Request permission if not yet decided
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showBrowserNotification(notification);
        }
      });
    }
  }

  private playNotificationSound() {
    try {
      // Tentar tocar arquivo MP3
      const audio = new Audio('assets/notification.mp3');
      audio.volume = 1.0; // Volume máximo (0.0 a 1.0)
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

      // Volume máximo com fade out suave
      gainNode.gain.setValueAtTime(1.0, audioContext.currentTime); // Volume máximo
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }
} 