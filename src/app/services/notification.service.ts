import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private socket: Socket;
  public notifications$ = new BehaviorSubject<any[]>([]);

  constructor() {
    // const userId = localStorage.getItem('userId'); // ou de authService
    const userId = 1; // ou de authService
    this.socket = io(environment.apiUrl, {
      query: { userId },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('ping', (notification) => {
      this.notifications$.next([notification, ...this.notifications$.value]);
    });
  }

  // Para iniciar com as antigas
  loadInitialNotifications(list: any[]) {
    this.notifications$.next(list);
  }
} 