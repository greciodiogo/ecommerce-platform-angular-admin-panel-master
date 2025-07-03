import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, Subscription } from 'rxjs';
import { ProductsActions, selectProductsList, selectShopsList, ShopsActions } from 'src/app/catalog/store';
import { Order } from 'src/app/core/api';
import { selectUsername, selectUserRole } from 'src/app/core/auth/store';
import { DashboardActions, OrdersActions, selectDashboardItems, selectOrdersListWithItems, selectOrderStatusDistribution, selectOrdersByPeriod } from 'src/app/sales/store';
import { FnService } from 'src/app/services/fn.helper.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
    periodControl = new FormControl<'weekly' | 'monthly' | 'yearly'>('monthly');

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

    orderStatusDistribution$ = this.store.select(selectOrderStatusDistribution);
    public orderStatusSeries: number[] = [];
    public orderStatusLabels: string[] = [];

    public barChartSeries: number[] = [];
    public barChartLabels: string[] = [];

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
    totalSales: 0,
    lowStockProductsCount: 0,
  }

  public dashboard_: any 

  constructor(public configService: FnService,
    private store: Store,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.dataSource.data = [];
    this.store.dispatch(ProductsActions.loadProducts({}));
    this.store.dispatch(OrdersActions.loadOrders({}));
    this.store.dispatch(DashboardActions.loadDashboard({ period: this.periodControl.value }));
    this.store.dispatch(ShopsActions.loadShops());
    this.view()

    this.shopperDashboard()

    this.periodControl.valueChanges.subscribe((period) => {
        this.store.dispatch(DashboardActions.loadDashboard({ period }));
    });
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
      this.orderStatusDistribution$,
      this.store.select(selectOrdersByPeriod(this.periodControl.value))
    ]).subscribe(([shops, products, orders, dashboard, statusDistribution, filteredOrders]) => {
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
        totalSales: dashboard.totalSales,
        lowStockProductsCount: dashboard.lowStockProductsCount
      }
      // Prepare data for pie chart
      if (statusDistribution && Object.keys(statusDistribution).length > 0) {
        this.orderStatusLabels = Object.keys(statusDistribution);
        this.orderStatusSeries = Object.values(statusDistribution);
        this.cdr.detectChanges();
      } else {
        this.orderStatusLabels = ["No Data"];
        this.orderStatusSeries = [1];
      }
      // Prepare data for bar chart (order count by month/week/year)
      const period = this.periodControl.value;
      let counts: { [key: string]: number } = {};
      let labels: string[] = [];
      if (filteredOrders && filteredOrders.length > 0) {
        if (period === 'weekly') {
          // Group by day of week
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          counts = days.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});
          filteredOrders.forEach(order => {
            const d = new Date(order.created);
            const day = days[d.getDay() === 0 ? 6 : d.getDay() - 1];
            counts[day]++;
          });
          labels = days;
        } else if (period === 'monthly') {
          // Group by day of month
          const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
          counts = days.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});
          filteredOrders.forEach(order => {
            const d = new Date(order.created);
            const day = d.getDate().toString();
            counts[day]++;
          });
          labels = days;
        } else {
          // Group by month
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          counts = months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {});
          filteredOrders.forEach(order => {
            const d = new Date(order.created);
            const month = months[d.getMonth()];
            counts[month]++;
          });
          labels = months;
        }
        this.barChartLabels = labels;
        this.barChartSeries = labels.map(label => counts[label]);
      } else {
        this.barChartLabels = ["No Data"];
        this.barChartSeries = [0];
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
