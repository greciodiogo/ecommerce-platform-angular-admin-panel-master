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
  private subscription!: Subscription;
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
    this.store.dispatch(ShopkeeperSalesActions.loadShopkeeperSales({ filters: {} }));

    this.subscription = this.shopkeeperSales$.subscribe((shopkeeperSales) => {
      this.dataSource.data = shopkeeperSales;
    });
  }

  applyFilters() {
    const filters = { ...this.filterForm.value };

    if (filters.date instanceof Date) {
      const date = filters.date as Date;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      filters.date = `${year}-${month}-${day}`;
    }

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value),
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
} 