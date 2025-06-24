import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { OrdersActions, selectOrdersListWithItems } from '../../store';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../../../core/api';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { selectUserRole } from 'src/app/core/auth/store';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit, AfterViewInit, OnDestroy {
  orders$ = this.store.select(selectOrdersListWithItems);
  dataSource = new MatTableDataSource<Order>();
  private subscription!: Subscription;
  role$ = this.store.select(selectUserRole);
  filterForm: FormGroup;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'created',
    'status',
    'itemsCount',
    'itemsTotal',
    'fullName',
    'delivery',
    'payment',
  ];

  constructor(private store: Store, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      orderNumber: [''],
      date: [''],
      shopName: [''],
    });
  }

  ngOnInit() {
    this.store.dispatch(OrdersActions.loadOrders({ filters: {} }));

    this.subscription = this.orders$.subscribe((orders) => {
      this.dataSource.data = orders;
    });
  }

  applyFilters() {
    const filters = { ...this.filterForm.value };

    if (filters.date instanceof Date) {
      const date = filters.date as Date;
      // Manually construct the date string in YYYY-MM-DD format to avoid timezone issues.
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      filters.date = `${year}-${month}-${day}`;
    }

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value)
    );
      
    this.store.dispatch(OrdersActions.loadOrders({ filters: cleanFilters }));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
