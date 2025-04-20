import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
// import { UsersActions } from '../../store';
import { User } from '../../../core/api';
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
import { UsersActions } from 'src/app/users/store';
import { selectUsersList } from 'src/app/users/store/selectors/accounts.selectors';

@Component({
  selector: 'app-shops-list',
  templateUrl: './shops-list.component.html',
  styleUrls: ['./shops-list.component.scss'],
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
export class ShopsListComponent implements OnInit, AfterViewInit, OnDestroy {
  shops$ = this.store.select(selectUsersList);
  expandedUser: User | null = null;
  dataSource = new MatTableDataSource<User>();
  subscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: Store) {}

  ngOnInit() {
    this.dataSource.data = [];
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.dataSource.data = await firstValueFrom(this.shops$);
    this.dataSource.paginator = this.paginator;
    this.subscription = this.shops$.subscribe((users) => {
      this.dataSource.data = users;
    });
    this.store.dispatch(UsersActions.loadUsers());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
