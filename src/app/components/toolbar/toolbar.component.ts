import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../core/auth/store/actions';
import { Title } from '@angular/platform-browser';
import { selectUserRole } from '../../core/auth/store';
import { selectNotification } from 'src/app/catalog/store/actions/notifications.actions';
import { NotificationsActions } from 'src/app/catalog/store';
import { selectNotificationsList } from 'src/app/catalog/store/selectors/notifications.selectors';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  matchesMedium: Observable<boolean>;
  notifications$ = this.store.select(selectNotificationsList);
  role$ = this.store.select(selectUserRole);
  public notifications
  public totalNotifications 
  subscription!: Subscription;

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
    breakpointObserver: BreakpointObserver,
    private store: Store,
    public title: Title,
  ) {
    this.matchesMedium = breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((v) => v.matches));
  }
  // ngOnInit(): void {
  //   this.api.getMyNotifications().subscribe((initial) => {
  //     this.notificationsService.loadInitialNotifications(initial);
  //   });

  //   this.notificationsService.notifications$.subscribe((list) => {
  //     this.notifications = list;
  //   });
  // }

  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

    async ngAfterViewInit() {
      // this.dataSource.data = await firstValueFrom(this.faqs$);
      this.subscription = this.notifications$.subscribe((notification) => {
        this.notifications = notification;
        this.totalNotifications = this.notifications.length
      });
      this.store.dispatch(NotificationsActions.loadNotifications());
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    }

}
