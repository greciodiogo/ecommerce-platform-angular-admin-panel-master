import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthActions, selectUser } from '../../core/auth/store';
import { Title } from '@angular/platform-browser';
import { selectUserRole } from '../../core/auth/store';
import { NotificationsService } from 'src/app/services/notification.service';
import { NotificationsApiService } from 'src/app/core/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  matchesMedium: Observable<boolean>;
  role$ = this.store.select(selectUserRole);
  user$ = this.store.select(selectUser);
  public notifications: any[] = [];
  public unreadCount = 0;
  private subscriptions: Subscription[] = [];

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
    breakpointObserver: BreakpointObserver,
    private store: Store,
    public title: Title,
    private notificationsService: NotificationsService,
    private notificationsApi: NotificationsApiService,
    private router: Router,
  ) {
    this.matchesMedium = breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((v) => v.matches));
  }

  ngOnInit(): void {
    // Subscribe to user to get userId for WebSocket connection
    const userSub = this.user$.subscribe((user) => {
      if (user?.id) {
        this.notificationsService.connect(user.id);
        this.loadNotifications();
      }
    });
    this.subscriptions.push(userSub);

    // Subscribe to notifications
    const notifSub = this.notificationsService.notifications$.subscribe((list) => {
      this.notifications = list.slice(0, 10); // Show only last 10
    });
    this.subscriptions.push(notifSub);

    // Subscribe to unread count
    const countSub = this.notificationsService.unreadCount$.subscribe((count) => {
      this.unreadCount = count;
    });
    this.subscriptions.push(countSub);
  }

  loadNotifications() {
    this.notificationsApi.findAllNotificationsMe().subscribe({
      next: (notifications) => {
        this.notificationsService.loadInitialNotifications(notifications);
      },
      error: (err) => {
        console.error('Failed to load notifications:', err);
      }
    });
  }

  onNotificationClick(notification: any) {
    if (!notification.isRead) {
      this.notificationsApi.markAsRead(notification.id).subscribe({
        next: () => {
          this.notificationsService.markAsRead(notification.id);
        },
        error: (err) => console.error('Failed to mark as read:', err)
      });
    }

    // Navigate to related page if actionUrl exists
    if (notification.actionUrl) {
      this.router.navigateByUrl(notification.actionUrl);
    } else if (notification.type === 'order' && notification.relatedEntityId) {
      this.router.navigate(['/sales/orders', notification.relatedEntityId]);
    }
  }

  markAllAsRead() {
    this.notificationsApi.markAllAsRead().subscribe({
      next: () => {
        this.notificationsService.markAllAsRead();
      },
      error: (err) => console.error('Failed to mark all as read:', err)
    });
  }

  viewAllNotifications() {
    this.router.navigate(['/notifications']);
  }

  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.notificationsService.disconnect();
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.notificationsService.disconnect();
  }
}
