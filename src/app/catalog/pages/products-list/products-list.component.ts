import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductsActions, selectProductsList } from '../../store';
import { Product } from '../../../core/api';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, firstValueFrom, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { selectUserRole } from 'src/app/core/auth/store';
import { FnService } from 'src/app/services/fn.helper.service';
import { DashboardActions, selectDashboardItems } from 'src/app/sales/store';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss', '../../../home/pages/main/main.component.css'],
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy {
  products$ = this.store.select(selectProductsList);
  role$ = this.store.select(selectUserRole);
  dataSource = new MatTableDataSource<Product>();
  subscription!: Subscription;

  dashboard$ = this.store.select(selectDashboardItems);
  displayedColumns: string[] = [];
  public dashboard_: any 

  public summary = {
  confirmedToday: 0,
  confirmedOrderWeek: 0,
  completedDeliveriesWeek: 0,
  newUsers: 0,
  totalSales: 0,
  lowStockProductsCount: 0,
}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public configService: FnService, private store: Store, public router: Router) {}

  ngOnInit() {
    this.dataSource.data = [];
    this.store.dispatch(DashboardActions.loadDashboard());
     this.role$.subscribe(role => {
    this.displayedColumns = [
      'id',
      'photo',
      'shop',
      'name',
      ...(role === 'sales' ? ['description'] : []),  // 👈 adiciona 'price' só se não for sales
      'purchasePrice',
      ...(role !== 'sales' ? ['price'] : []),  // 👈 adiciona 'price' só se não for sales
      'stock',
      'visible',
    ];
  });
    this.view()
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.dataSource.data = await firstValueFrom(this.products$);
    this.subscription = this.products$.subscribe((products) => {
      this.dataSource.data = products;
    });
    this.store.dispatch(ProductsActions.loadProducts());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

    async view() {
      this.subscription = combineLatest([
        this.products$,
        this.dashboard$,
      ]).subscribe(([products, dashboard]) => {
        this.dashboard_ = {
          totalProducts: products?.length || 0,
          lowStockProductsCount: dashboard?.lowStockProductsCount || 0
        };
        this.summary = {
          confirmedToday: dashboard.confirmedToday,
          confirmedOrderWeek: dashboard.confirmedOrderWeek,
          completedDeliveriesWeek: dashboard.completedDeliveriesWeek,
          newUsers: dashboard.newUsers,
          totalSales: dashboard.totalSales,
          lowStockProductsCount: dashboard.lowStockProductsCount
        }
      });
    }
}
