import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, Subscription } from 'rxjs';
import { ProductsActions, selectProductsList, selectShopsList, ShopsActions } from 'src/app/catalog/store';
import { Order } from 'src/app/core/api';
import { selectUsername, selectUserRole } from 'src/app/core/auth/store';
import { DashboardActions, OrdersActions, selectDashboardItems, selectOrdersListWithItems } from 'src/app/sales/store';
import { FnService } from 'src/app/services/fn.helper.service';

@Component({
  selector: 'app-index',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
    // Dados do Dashboard
    dashboard$ = this.store.select(selectDashboardItems);

    orders$ = this.store.select(selectOrdersListWithItems);
    products$ = this.store.select(selectProductsList);
    shops$ = this.store.select(selectShopsList);
    role$ = this.store.select(selectUserRole);
    username$ = this.store.select(selectUsername);
    dataSource = new MatTableDataSource<Order>();
    subscription!: Subscription;

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

  public dashboard: any = {
    totalProductsInStock: 0,
    totalProductsValue: 0,
    totalProductsSoldValue: 0,
    totalActiveProducts: 0,
  };

  public summary = {
    confirmedToday: 0,
    confirmedOrderWeek: 0,
    completedDeliveriesWeek: 0,
    newUsers: 0,
    totalSales: 0
  }

  public dashboard_: any 

  constructor(public configService: FnService,
    private store: Store) { }

  ngOnInit() {
    this.dataSource.data = [];
    this.store.dispatch(ProductsActions.loadProducts());
    this.store.dispatch(OrdersActions.loadOrders());
    this.store.dispatch(DashboardActions.loadDashboard());
    this.store.dispatch(ShopsActions.loadShops());
    this.view()

    this.shopperDashboard()
  }


  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


  public lastOrders
  async view() {
    this.subscription = combineLatest([
      this.shops$,
      this.products$,
      this.orders$,
      this.dashboard$,
    ]).subscribe(([shops, products, orders, dashboard]) => {
      this.lastOrders = orders.slice(0,4)
      this.dashboard_ = {
        totalShops: shops?.length || 0,
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0
      };
      this.summary = {
        confirmedToday: dashboard.confirmedToday,
        confirmedOrderWeek: dashboard.confirmedOrderWeek,
        completedDeliveriesWeek: dashboard.completedDeliveriesWeek,
        newUsers: dashboard.newUsers,
        totalSales: dashboard.totalSales
      }
    });
  }

  async shopperDashboard(){
    this.products$.subscribe(products => {
      this.dashboard.totalProductsInStock = products.reduce((acc, p) => acc + (p.stock ?? 0), 0);
      this.dashboard.totalProductsValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
      this.dashboard.totalProductsSoldValue = products.reduce((acc, p) => acc + (p.price ?? 0), 0);
      this.dashboard.totalActiveProducts = products.filter(p => p.visible === true).length;
    });
  }
}
