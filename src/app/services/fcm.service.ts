import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private messaging: Messaging | null = null;
  private app: FirebaseApp | null = null;

  constructor(private http: HttpClient) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const firebaseConfig = {
        apiKey: "AIzaSyCxCPAEE3TJGCEhNpGON0xows-qFx3STL4",
        authDomain: "encontrar-nestjs.firebaseapp.com",
        projectId: "encontrar-nestjs",
        storageBucket: "encontrar-nestjs.firebasestorage.app",
        messagingSenderId: "845426261563",
        appId: "1:845426261563:web:d7c0fca5967501fba6a61e",
        measurementId: "G-FGK6G36VVZ"
      };

      this.app = initializeApp(firebaseConfig);
      this.messaging = getMessaging(this.app);
      
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }

  async requestPermission(): Promise<string | null> {
    if (!this.messaging) {
      console.error('Firebase messaging not initialized');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted');
        
        // Get FCM token
        const token = await getToken(this.messaging, {
          vapidKey: 'BJRd7QoNf1znUGn0z5_U40sdi-I7gh-Sno__lnKuO0-LFVh_6LOAWwFxf122b10bAGIW1JPih1RHlfmrWs0TReA' // Obtenha em Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
        });
        
        console.log('FCM Token:', token);
        
        // Register token with backend
        await this.registerToken(token);
        
        return token;
      } else {
        console.log('Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  private async registerToken(token: string): Promise<void> {
    try {
      const deviceInfo = this.getDeviceInfo();
      
      await this.http.post(`${environment.apiUrl}/notifications/device-tokens`, {
        token,
        deviceName: deviceInfo.name,
        deviceType: deviceInfo.type
      }).toPromise();
      
      console.log('Device token registered successfully');
    } catch (error) {
      console.error('Error registering device token:', error);
    }
  }

  async unregisterToken(token: string): Promise<void> {
    try {
      await this.http.delete(`${environment.apiUrl}/notifications/device-tokens/${token}`).toPromise();
      console.log('Device token unregistered successfully');
    } catch (error) {
      console.error('Error unregistering device token:', error);
    }
  }

  listenToMessages(callback: (payload: any) => void): void {
    if (!this.messaging) {
      console.error('Firebase messaging not initialized');
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
      
      // Show browser notification
      if (payload.notification) {
        this.showNotification(
          payload.notification.title || 'Nova Notificação',
          payload.notification.body || '',
          payload.data
        );
      }
      
      callback(payload);
    });
  }

  private showNotification(title: string, body: string, data?: any): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/assets/logo.png',
        badge: '/assets/logo.png',
        data
      });

      notification.onclick = () => {
        window.focus();
        if (data?.actionUrl) {
          window.location.href = data.actionUrl;
        }
        notification.close();
      };
    }
  }

  private getDeviceInfo(): { name: string; type: string } {
    const userAgent = navigator.userAgent;
    let deviceType = 'web';
    let deviceName = 'Web Browser';

    if (/Android/i.test(userAgent)) {
      deviceType = 'android';
      deviceName = 'Android Browser';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      deviceType = 'ios';
      deviceName = 'iOS Browser';
    } else if (/Chrome/i.test(userAgent)) {
      deviceName = 'Chrome';
    } else if (/Firefox/i.test(userAgent)) {
      deviceName = 'Firefox';
    } else if (/Safari/i.test(userAgent)) {
      deviceName = 'Safari';
    } else if (/Edge/i.test(userAgent)) {
      deviceName = 'Edge';
    }

    return { name: deviceName, type: deviceType };
  }

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}
