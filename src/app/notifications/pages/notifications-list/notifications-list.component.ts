import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notification.service';
import { NotificationsApiService } from 'src/app/core/api';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss'],
})
export class NotificationsListComponent implements OnInit, OnDestroy {
  allNotifications: any[] = [];
  filteredNotifications: any[] = [];
  loading = false;
  filter: 'all' | 'unread' | 'read' = 'unread';
  private subscription?: Subscription;

  constructor(
    private notificationsService: NotificationsService,
    private notificationsApi: NotificationsApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllNotifications();
  }

  get unreadCount(): number {
    return this.allNotifications.filter(n => !n.isRead).length;
  }

  get readCount(): number {
    return this.allNotifications.filter(n => n.isRead).length;
  }

  get totalCount(): number {
    return this.allNotifications.length;
  }

  loadAllNotifications() {
    this.loading = true;
    this.notificationsApi.findAllNotificationsMe(true).subscribe({
      next: (notifications) => {
        this.allNotifications = notifications;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load notifications:', err);
        this.loading = false;
      }
    });
  }

  applyFilter() {
    switch (this.filter) {
      case 'unread':
        this.filteredNotifications = this.allNotifications.filter(n => !n.isRead);
        break;
      case 'read':
        this.filteredNotifications = this.allNotifications.filter(n => n.isRead);
        break;
      default:
        this.filteredNotifications = [...this.allNotifications];
    }
  }

  onFilterChange(filter: 'all' | 'unread' | 'read') {
    this.filter = filter;
    this.applyFilter();
  }

  onNotificationClick(notification: any) {
    if (!notification.isRead) {
      this.notificationsApi.markAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
          this.notificationsService.markAsRead(notification.id);
          this.applyFilter();
        },
        error: (err) => console.error('Failed to mark as read:', err)
      });
    }

    // Navigate to related page
    if (notification.actionUrl) {
      this.router.navigateByUrl(notification.actionUrl);
    } else if (notification.type === 'order' && notification.relatedEntityId) {
      this.router.navigate(['/sales/orders', notification.relatedEntityId]);
    }
  }

  markAllAsRead() {
    this.notificationsApi.markAllAsRead().subscribe({
      next: () => {
        this.allNotifications.forEach(n => n.isRead = true);
        this.notificationsService.markAllAsRead();
        this.applyFilter();
      },
      error: (err) => console.error('Failed to mark all as read:', err)
    });
  }

  deleteNotification(notification: any, event: Event) {
    event.stopPropagation();
    
    if (confirm('Deseja realmente excluir esta notificação?')) {
      this.notificationsApi.deleteNotification(notification.id).subscribe({
        next: () => {
          this.allNotifications = this.allNotifications.filter(n => n.id !== notification.id);
          this.notificationsService.removeNotification(notification.id);
          this.applyFilter();
        },
        error: (err) => console.error('Failed to delete notification:', err)
      });
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'order': return 'shopping_cart';
      case 'product': return 'inventory_2';
      case 'system': return 'settings';
      case 'promotion': return 'local_offer';
      default: return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'order': return 'primary';
      case 'product': return 'accent';
      case 'system': return 'warn';
      case 'promotion': return 'success';
      default: return '';
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
