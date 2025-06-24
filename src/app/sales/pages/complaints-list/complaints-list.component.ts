import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { OrdersActions, selectDeliveryMethodsList, selectOrdersListWithItems, selectPaymentMethodsList } from '../../store';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../../../core/api';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { ProductsActions } from '../../../catalog/store';
import { MatPaginator } from '@angular/material/paginator';
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: 'app-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
})
export class ComplaintsListComponent implements OnInit, AfterViewInit, OnDestroy {
  orders$ = this.store.select(selectOrdersListWithItems);
  dataSource = new MatTableDataSource<Order>();
  subscription!: Subscription;
  role$ = this.store.select(selectUserRole);

    deliveryMethods$ = this.store.select(selectDeliveryMethodsList);
    paymentMethods$ = this.store.select(selectPaymentMethodsList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: Store) {}

  ngOnInit() {
    this.dataSource.data = [];
    this.store.dispatch(ProductsActions.loadProducts({}));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.dataSource.data = await firstValueFrom(this.orders$);
    this.subscription = this.orders$.subscribe((orders) => {
      // this.dataSource.data = orders;
      this.dataSource.data = [];
    });
    this.store.dispatch(OrdersActions.loadOrders({}));
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
