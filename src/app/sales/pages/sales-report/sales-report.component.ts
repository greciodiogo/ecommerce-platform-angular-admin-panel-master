import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ShopkeepersalesApiService } from 'src/app/core/api/api/shopkeepersales-api.service';
import { ExportExcelService } from 'src/app/settings/services/export-excel.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  filterForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'order_number',
    'productId',
    'productName',
    'quantity',
    'date',
  ];
  loading = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private salesApi: ShopkeepersalesApiService,
    private exportExcelService: ExportExcelService
  ) {
    this.filterForm = this.fb.group({
      orderNumber: [''],
      productName: [''],
      productId: [''],
      date: [''],
      shopName: [''],
    });
  }

  ngOnInit() {
    this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    try {
      const filters = { ...this.filterForm.value };

      if (filters.date instanceof Date) {
        filters.date = moment(filters.date).format('YYYY-MM-DD');
      }

      const sales = await this.salesApi
        .findMySales(
          filters.orderNumber || undefined,
          filters.productName || undefined,
          filters.productId || undefined,
          filters.date || undefined,
          undefined
        )
        .toPromise();

      // Flatten products for report rows
      const rows = [];
      for (const sale of sales) {
        for (const product of sale.products) {
          rows.push({
            order_number: sale.order_number,
            productId: product.product.id,
            productName: product.product.name,
            quantity: product.quantity,
            date: sale.created,
          });
        }
      }
      this.dataSource.data = rows;
      if (this.sort) this.dataSource.sort = this.sort;
      if (this.paginator) this.dataSource.paginator = this.paginator;
    } catch (e) {
      console.error('Failed to fetch sales report data:', e);
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    this.fetchData();
  }

  exportAsExcel() {
    const data = this.dataSource.data;
    const keys = [
      { key: 'order_number', width: 20 },
      { key: 'productId', width: 15 },
      { key: 'productName', width: 30 },
      { key: 'quantity', width: 10 },
      { key: 'date', width: 20 },
    ];
    const cols = ['Order Number', 'Product ID', 'Product Name', 'Quantity', 'Date'];
    const title = 'Sales Report';
    const nameFile =
      'Sales Report [' + moment().format('DD-MM-YYYY_HH-mm') + ']';
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