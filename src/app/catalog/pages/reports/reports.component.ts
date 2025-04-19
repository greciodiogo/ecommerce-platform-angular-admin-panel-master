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
      url: '/report/monthly-products-report',
      name: 'Monthly Products Report',
      icon: 'calendar_view_month',
      color: 'primary',
      status: 'active'
    },
    {
      url: '/report/monthly-orders-report',
      name: 'Monthly Orders Report',
      icon: 'calendar_view_month',
      color: 'primary',
      status: 'disable'
    },
  ];
  filter = {
    provincie: 'LUANDA',
    shops: ' ALL',
    products: 'ALL',
    categories: 'ALL',
    year: 2025
  }

  products$ = this.store.select(selectProductsList);
  dataSource = new MatTableDataSource<Product>();
  subscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store,
    public router: Router,
    public formService: FormService,
    public exportExcelService: ExportExcelService, // private configService: ConfigService, //private excelService: ExcelService, //private ReportFacturacaoDiariaGlobalService: ReportFacturacaoDiariaGlobalService
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
    this.store.dispatch(ProductsActions.loadProducts());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  generateReport(report: any) {
    this.exportAsXLSX();
  }

  public exportAsXLSX() {

    var filtros = this.formService.getFilterExcel(this.filter);

    
    var movimentosExcel = JSON.parse(JSON.stringify(this.dataSource.data));

    for (let i = 0; i < movimentosExcel?.length; i++) {
      movimentosExcel[i].filial_nome = 'default'
      movimentosExcel[i].type_shop = 'default'
      movimentosExcel[i].commission = 0;
      movimentosExcel[i].filial_nome = 'default'
  }

    var CurrentDate = new Date();
    var keys = [
      { key: 'filial_nome', width: 40 },
      { key: 'type_shop', width: 40 },
      { key: 'category', width: 50 },
      { key: 'name', width: 25 },
      { key: 'stock', width: 20 },
      { key: 'price', width: 25 },
      { key: 'delivery_tax', width: 20 },
      { key: 'service_fee', width: 20 },
      { key: 'commission', width: 25 },
      { key: 'total', width: 25, style: { font: { name: 'Calibri' } } },
    ];

    // var Cols = ['DATE', 'REPORT NUMBER', 'SHOP ID & NAME', 'PRODUCT', 'QUANTITY', 'PRICE', 'AMOUNT'];
    var Cols = ['SHOP ID & NAME', 'TYPES OF SHOPS', 'CATEGORY OF PRODUCT', 'PRODUCT', 'QUANTITY', 'PRICE OF SHOP', 'DELIVERY TAX', 'SERVICE FEE', 'COMMISSION', 'TOTAL AMOUNT'];

    var title = 'Monthly Products Report - ';
    var nameFile =
      'Monthly Products Report - [' +
      moment(CurrentDate).format('DD') +
      '-' +
      moment(CurrentDate).format('MM') +
      '-' +
      moment(CurrentDate).format('YYYY') +
      ' ]' +
      moment(CurrentDate).format('H') +
      ':' +
      moment(CurrentDate).format('m');
    this.exportExcelService.excels(
      this.dataSource.data,
      nameFile,
      keys,
      Cols,
      title,
      15,
      10,
      40,
      3,
      [1],
      false,
      filtros,
    );
  }
}
