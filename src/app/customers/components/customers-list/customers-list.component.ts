import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { UsersActions } from '../../../users/store';
import { selectUsersList } from '../../../users/store/selectors/accounts.selectors';
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

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
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
export class CustomersListComponent implements OnInit, AfterViewInit, OnDestroy {
  customers$ = this.store.select(selectUsersList);
  expandedCustomer: User | null = null;
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
    this.dataSource.data = await firstValueFrom(this.customers$);
    this.dataSource.paginator = this.paginator;
    this.subscription = this.customers$.subscribe((customers) => {
      this.dataSource.data = customers;
    });
    this.store.dispatch(UsersActions.loadCustomers());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
