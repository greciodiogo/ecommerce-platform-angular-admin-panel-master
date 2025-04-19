import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { firstValueFrom, Subscription } from 'rxjs';
import { ProductsActions } from 'src/app/catalog/store';
import { Order } from 'src/app/core/api';
import { selectUserRole } from 'src/app/core/auth/store';
import { OrdersActions, selectOrdersListWithItems } from 'src/app/sales/store';
import { FnService } from 'src/app/services/fn.helper.service';

@Component({
  selector: 'app-index',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
    orders$ = this.store.select(selectOrdersListWithItems);
    role$ = this.store.select(selectUserRole);
    dataSource = new MatTableDataSource<Order>();
    subscription!: Subscription;

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataJson = [
    {
      "id": 1,
      "name": "Macbook Pro ",
      "price": 3.5,
      "created_at": "2025-04-18",
    },
  ]
  public dashboard: any = {
    facturas: 0,
    clientes: 0,
    produtos: 0,
    recibos: 0,
    servicos: 0,
    vendas: 0
  };

  constructor(public configService: FnService,
    private store: Store) { }

  ngOnInit() {
    this.dataSource.data = [];
    this.store.dispatch(ProductsActions.loadProducts());
    this.ngAfterViewInit()
  }


  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


  async ngAfterViewInit() {
    this.dataSource.data = await firstValueFrom(this.orders$);
    this.subscription = this.orders$.subscribe((orders) => {
      this.dataSource.data = orders;
    });
    this.store.dispatch(OrdersActions.loadOrders());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
