import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private socket: Socket;
  public notifications$ = new BehaviorSubject<any[]>([]);

  constructor() {
    // const userId = localStorage.getItem('userId'); // ou de authService
    const userId = 1 // ou de authService
    this.socket = io('http://localhost:3000', {
      query: { userId },
    });

    this.socket.on('notification', (notification) => {
      this.notifications$.next([
        notification,
        ...this.notifications$.value,
      ]);
    });
  }

  // Para iniciar com as antigas
  loadInitialNotifications(list: any[]) {
    this.notifications$.next(list);
  }
}
