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
import { firstValueFrom, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { ExportExcelService } from 'src/app/settings/services/export-excel.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  reportsTypes = [
    {
      url: '/catalog/reports/products',
      name: 'Products Report',
      icon: 'inventory_2',
      color: 'primary',
      status: 'active'
    },
    {
      url: '/sales/orders-report',
      name: 'Orders Report',
      icon: 'receipt_long',
      color: 'accent',
      status: 'active'
    },
    // {
    //   url: '/sales/sales-report',
    //   name: 'Sales Report',
    //   icon: 'trending_up',
    //   color: 'warn',
    //   status: 'active'
    // },
  ];

  products$ = this.store.select(selectProductsList);
  dataSource = new MatTableDataSource<Product>();
  subscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store,
    public router: Router,
    public formService: FormService,
    public exportExcelService: ExportExcelService,
  ) {}

  ngOnInit() {
    this.dataSource.data = [];
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.dataSource.data = await firstValueFrom(this.products$);
    this.subscription = this.products$.subscribe((products) => {
      this.dataSource.data = products;
    });
    this.store.dispatch(ProductsActions.loadProducts({}));
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  navigateToReport(report: any) {
    console.log('Navigating to:', report.url);
    this.router.navigateByUrl(report.url);
  }
}
