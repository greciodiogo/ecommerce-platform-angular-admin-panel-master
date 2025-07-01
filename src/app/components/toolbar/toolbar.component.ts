import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../core/auth/store/actions';
import { Title } from '@angular/platform-browser';
import { selectUserRole } from '../../core/auth/store';
import { NotificationsService } from 'src/app/services/notification.service';
import { NotificationsApiService } from 'src/app/core/api';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  matchesMedium: Observable<boolean>;
  role$ = this.store.select(selectUserRole);
  public notifications: any[] = [];
  public totalNotifications = 0;
  subscription!: Subscription;

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
    breakpointObserver: BreakpointObserver,
    private store: Store,
    public title: Title,
    private notificationsService: NotificationsService,
    private notificationsApi: NotificationsApiService,
  ) {
    this.matchesMedium = breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((v) => v.matches));
  }
  ngOnInit(): void {
    this.notificationsApi.findAllNotificationsMe().subscribe((initial) => {
      this.notificationsService.loadInitialNotifications(initial);
    });

    this.subscription = this.notificationsService.notifications$.subscribe((list) => {
      this.notifications = list;
      this.totalNotifications = list.length;
    });
  }

  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
