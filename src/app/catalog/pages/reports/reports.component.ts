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
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  filterForm: FormGroup;
  products$ = this.store.select(selectProductsList);
  dataSource = new MatTableDataSource<Product>();
  subscription!: Subscription;
  loading = false;
  displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'price',
    'stock',
    'shop',
    'created',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store,
    public router: Router,
    private fb: FormBuilder,
    public exportExcelService: ExportExcelService,
  ) {
    this.filterForm = this.fb.group({
      productName: [''],
      category: [''],
      shop: [''],
      minPrice: [''],
      maxPrice: [''],
      minStock: [''],
      maxStock: [''],
    });
  }

  ngOnInit() {
    this.dataSource.data = [];
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    try {
      this.dataSource.data = await firstValueFrom(this.products$);
      this.subscription = this.products$.subscribe((products) => {
        this.dataSource.data = products;
      });
      this.store.dispatch(ProductsActions.loadProducts({}));
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (e) {
      console.error('Failed to fetch products report data:', e);
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    this.fetchData();
  }

  public exportAsXLSX() {
    const data = this.dataSource.data;
    const keys = [
      { key: 'id', width: 15 },
      { key: 'name', width: 40 },
      { key: 'category', width: 30 },
      { key: 'price', width: 20 },
      { key: 'stock', width: 15 },
      { key: 'shop', width: 30 },
      { key: 'created', width: 25 },
    ];

    const cols = ['Product ID', 'Product Name', 'Category', 'Price', 'Stock', 'Shop', 'Created Date'];
    const title = 'Products Report';
    const nameFile =
      'Products Report [' + moment().format('DD-MM-YYYY_HH-mm') + ']';
    
    this.exportExcelService.excels(
      data,
      nameFile,
      keys,
      cols,
      title,
      5,
      5,
      20,
      3,
      [1],
      false,
      []
    );
  }
}
