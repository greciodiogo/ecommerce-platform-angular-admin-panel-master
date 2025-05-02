import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { OrdersActions, selectDeliveryMethodsList, selectOrdersListWithItems, selectPaymentMethodsList, selectSalesListWithItems } from '../../store';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../../../core/api';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { ProductsActions } from '../../../catalog/store';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss'],
})
export class SalesListComponent implements OnInit, AfterViewInit, OnDestroy {
  sales$ = this.store.select(selectSalesListWithItems);
  dataSource = new MatTableDataSource<Order>();
  subscription!: Subscription;

  deliveryMethods$ = this.store.select(selectDeliveryMethodsList);
  paymentMethods$ = this.store.select(selectPaymentMethodsList);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: Store) {}

  ngOnInit() {
    this.dataSource.data = [];
    this.store.dispatch(ProductsActions.loadProducts());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.dataSource.data = await firstValueFrom(this.sales$);
    this.subscription = this.sales$.subscribe((sales) => {
      this.dataSource.data = sales;
    });
    this.store.dispatch(OrdersActions.loadSales());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
