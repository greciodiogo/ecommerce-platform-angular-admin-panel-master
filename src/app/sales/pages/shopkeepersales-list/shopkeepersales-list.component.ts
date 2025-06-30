import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ShopkeeperSalesActions,
  selectShopkeeperSalesList,
} from '../../store';
import { MatTableDataSource } from '@angular/material/table';
import { ShopkeeperSale } from '../../../core/api';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { selectUserRole } from 'src/app/core/auth/store';
import { ExportExcelService } from 'src/app/settings/services/export-excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-shopkeepersales-list',
  templateUrl: './shopkeepersales-list.component.html',
  styleUrls: ['./shopkeepersales-list.component.scss'],
})
export class ShopkeeperSalesListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  shopkeeperSales$ = this.store.select(selectShopkeeperSalesList);
  dataSource = new MatTableDataSource<ShopkeeperSale>();
  role$ = this.store.select(selectUserRole);
  private subscription!: Subscription;
  filterForm: FormGroup;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'created',
    'order_number',
    // 'shop',
    'quantity',
  ];

  constructor(private store: Store, private fb: FormBuilder, private exportExcelService: ExportExcelService) {
    this.filterForm = this.fb.group({
      orderNumber: [''],
      productName: [''],
      date: [''],
      shopName: [''],
    });
  }

  ngOnInit() {
    this.store.dispatch(ShopkeeperSalesActions.loadShopkeeperSales({ filters: {} }));

    this.subscription = this.shopkeeperSales$.subscribe((shopkeeperSales) => {
      this.dataSource.data = shopkeeperSales;
    });
  }

  applyFilters() {
    const filters = { ...this.filterForm.value };

    if (filters.date instanceof Date) {
      filters.date = moment(filters.date).format('YYYY-MM-DD');
    }

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null && value !== ''),
    );

    this.store.dispatch(
      ShopkeeperSalesActions.loadShopkeeperSales({ filters: cleanFilters }),
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  exportAsExcel() {
    // Flatten each sale into multiple rows if it has multiple products
    const data = this.dataSource.data.flatMap(sale =>
      (sale.products || []).map(product => ({
        id: sale.id,
        created: sale.created ? moment(sale.created).format('D MMM YYYY, HH:mm') : '',
        order_number: sale.order_number,
        product: product.product?.name || '',
        quantity: product.quantity
      }))
    );
    const keys = [
      { key: 'id', width: 10 },
      { key: 'created', width: 25 },
      { key: 'order_number', width: 20 },
      { key: 'product', width: 30 },
      { key: 'quantity', width: 10 },
    ];
    const cols = ['ID', 'Created', 'Order Number', 'Product', 'Quantity'];
    const title = 'Shopkeeper Sales Report';
    const nameFile = 'Shopkeeper Sales Report [' + moment().format('DD-MM-YYYY_HH-mm') + ']';
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