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
    },
    {
      url: '/report/monthly-orders-report',
      name: 'Monthly Orders Report',
      icon: 'calendar_view_month',
      color: 'primary',
    },
  ];
  products$ = this.store.select(selectProductsList);
  dataSource = new MatTableDataSource<Product>();
  subscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store,
    public router: Router,
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
    // var movimentosExcel = JSON.parse(JSON.stringify(this.cobrancas));

    // for (let i = 0; i < movimentosExcel.length; i++) {
    //   if (movimentosExcel[i].pago == 1) {
    //     movimentosExcel[i].total = movimentosExcel[i].total;
    //   } else {
    //     movimentosExcel[i].total =
    //       movimentosExcel[i].total - movimentosExcel[i].valor_aberto;
    //   }

    //   movimentosExcel[i].created_at = moment(
    //     movimentosExcel[i].created_at
    //   ).format('MM/DD/YYYY');
    // }

    var CurrentDate = new Date();
    var keys = [
      { key: 'filial_nome', width: 25 },
      { key: 'loja_nome', width: 25 },
      { key: 'factura_sigla', width: 25 },
      { key: 'total', width: 25, style: { font: { name: 'Calibri' } } },
      { key: 'created_at', width: 25, style: { font: { name: 'Calibri' } } },
    ];

    var Cols = ['Província', 'Loja', 'Documento', 'Valor', 'Data'];

    var title = 'Facturação Diária - ';
    var nameFile =
      'Facturação Diária - [' +
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
      5,
      40,
      3,
      [1],
      false,
      {},
    );
  }
}
