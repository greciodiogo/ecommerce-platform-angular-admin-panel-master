// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCxCPAEE3TJGCEhNpGON0xows-qFx3STL4",
  authDomain: "encontrar-nestjs.firebaseapp.com",
  projectId: "encontrar-nestjs",
  storageBucket: "encontrar-nestjs.firebasestorage.app",
  messagingSenderId: "845426261563",
  appId: "1:845426261563:web:d7c0fca5967501fba6a61e",
  measurementId: "G-FGK6G36VVZ"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Nova Notificação';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/assets/logo.png',
    badge: '/assets/logo.png',
    data: payload.data,
    tag: payload.data?.id || 'notification',
    requireInteraction: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();
  
  // Navigate to action URL if provided
  if (event.notification.data?.actionUrl) {
    event.waitUntil(
      clients.openWindow(event.notification.data.actionUrl)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
