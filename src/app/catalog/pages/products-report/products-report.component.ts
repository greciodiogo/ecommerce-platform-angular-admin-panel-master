import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ProductsActions, selectProductsList } from '../../store';
import { Product } from '../../../core/api';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { ExportExcelService } from 'src/app/settings/services/export-excel.service';

@Component({
  selector: 'app-products-report',
  templateUrl: './products-report.component.html',
  styleUrls: ['./products-report.component.scss'],
})
export class ProductsReportComponent implements OnInit {
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
    private fb: FormBuilder,
    private store: Store,
    private exportExcelService: ExportExcelService
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
    this.fetchData();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
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
    const data = this.dataSource.data.map(row => ({
      ...row,
      shop: row.shop?.shopName || 'N/A',
      created: row.created ? (typeof row.created === 'string' ? (new Date(row.created)) : row.created) : '',
    }));
    const keys = [
      { key: 'id', width: 15 },
      { key: 'name', width: 40 },
      { key: 'shop', width: 30 },
      { key: 'stock', width: 15 },
      { key: 'price', width: 20 },
      { key: 'created', width: 25 },
    ];

    const cols = ['Product ID', 'Product Name', 'Shop', 'Stock', 'Price', 'Created Date'];
    const title = 'Products Report';
    const nameFile =
      'Products Report [' + moment().format('DD-MM-YYYY_HH-mm') + ']';
    
    this.exportExcelService.excels(
      data.map(row => ({
        ...row,
        created: row.created ? moment(row.created).format('D MMM YYYY, HH:mm') : '',
      })),
      nameFile,
      keys,
      cols,
      title,
      5,
      6,
      20,
      3,
      [1],
      false,
      []
    );
  }
} 