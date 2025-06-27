import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersApiService } from 'src/app/core/api/api/orders-api.service';
import { ExportExcelService } from 'src/app/settings/services/export-excel.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';

@Component({
  selector: 'app-orders-report',
  templateUrl: './orders-report.component.html',
  styleUrls: ['./orders-report.component.scss'],
})
export class OrdersReportComponent implements OnInit {
  filterForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'order_number',
    'customer_name',
    'total_amount',
    'status',
    'payment_method',
    'delivery_method',
    'created_date',
  ];
  loading = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private ordersApi: OrdersApiService,
    private exportExcelService: ExportExcelService
  ) {
    this.filterForm = this.fb.group({
      orderNumber: [''],
      customerName: [''],
      status: [''],
      paymentMethod: [''],
      deliveryMethod: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    try {
      const filters = this.filterForm.value;
      const startDateStr = filters.startDate instanceof Date
        ? moment(filters.startDate).format('YYYY-MM-DD')
        : filters.startDate;
      const endDateStr = filters.endDate instanceof Date
        ? moment(filters.endDate).format('YYYY-MM-DD')
        : filters.endDate;
      
      const orders = await this.ordersApi
        .getOrders(
          filters.orderNumber || undefined,
          startDateStr || undefined,
          filters.customerName || undefined
        )
        .toPromise();

      this.dataSource.data = (orders || []).map(order => ({
        order_number: order.order_number,
        fullName: order.fullName,
        total_amount: (order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0)
          + (order.delivery?.method?.price || 0)
          + (order.payment?.method?.price || 0),
        status: order.status,
        payment_method: order.payment?.method?.name || 'N/A',
        delivery_method: order.delivery?.method?.name || 'N/A',
        created_date: order.created,
      }));
      if (this.sort) this.dataSource.sort = this.sort;
      if (this.paginator) this.dataSource.paginator = this.paginator;
    } catch (e) {
      console.error('Failed to fetch orders report data:', e);
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
      { key: 'fullName', width: 30 },
      { key: 'total_amount', width: 20 },
      { key: 'status', width: 15 },
      { key: 'payment_method', width: 20 },
      { key: 'delivery_method', width: 20 },
      { key: 'created_date', width: 25 },
    ];
    const cols = ['Order Number', 'Customer Name', 'Total Amount', 'Status', 'Payment Method', 'Delivery Method', 'Created Date'];
    const title = 'Orders Report';
    const nameFile =
      'Orders Report [' + moment().format('DD-MM-YYYY_HH-mm') + ']';
    this.exportExcelService.excels(
      data,
      nameFile,
      keys,
      cols,
      title,
      5,
      7,
      20,
      3,
      [1],
      false,
      []
    );
  }
} 