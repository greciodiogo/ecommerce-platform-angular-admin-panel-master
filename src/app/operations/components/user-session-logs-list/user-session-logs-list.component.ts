import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { loadUserSessionLogs, loadUserSessionLogsSuccess, loadUserSessionLogsFailure } from '../../store/actions/user-session-logs.actions';
import { selectUserSessionLogsList } from '../../store/selectors/user-session-logs.selectors';
import { OperationLog } from '../../model/operation-log.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

function sortLogsByTimestampDesc(logs: OperationLog[]): OperationLog[] {
  return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

@Component({
  selector: 'app-user-session-logs-list',
  templateUrl: './user-session-logs-list.component.html',
  styleUrls: ['./user-session-logs-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class UserSessionLogsListComponent implements OnInit, AfterViewInit, OnDestroy {
  logs$ = this.store.select(selectUserSessionLogsList);
  expandedLog: OperationLog | null = null;
  dataSource = new MatTableDataSource<OperationLog>();
  subscription!: Subscription;
  UserSessionLogsActions = { loadUserSessionLogs, loadUserSessionLogsSuccess, loadUserSessionLogsFailure };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public store: Store) {}

  ngOnInit() {
    this.dataSource.data = [];
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    const logs = await firstValueFrom(this.logs$);
    this.dataSource.data = sortLogsByTimestampDesc(logs);
    this.dataSource.paginator = this.paginator;
    this.subscription = this.logs$.subscribe((logs) => {
      this.dataSource.data = sortLogsByTimestampDesc(logs);
    });
    this.store.dispatch(loadUserSessionLogs());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
} 