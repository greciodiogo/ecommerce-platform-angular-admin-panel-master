import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/api';
import { selectUserRole } from 'src/app/core/auth/store';
import { FnService } from 'src/app/services/fn.helper.service';
import { ProductsActions, selectProductsList } from '../../store';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  products$ = this.store.select(selectProductsList);
  role$ = this.store.select(selectUserRole);

  dataSource = new MatTableDataSource<Product>();
  private subscription!: Subscription;

  filterForm: FormGroup;
  displayedColumns: string[] = [
    'id',
    'photo',
    'shop',
    'name',
    'purchasePrice',
    'price',
    'stock',
    'visible',
  ];

  constructor(
    public configService: FnService,
    private store: Store,
    public router: Router,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      id: [''],
      name: [''],
      shopName: [''],
      withVisible: [null],
    });
  }

  ngOnInit() {
    this.store.dispatch(ProductsActions.loadProducts({ filters: {} }));

    this.subscription = this.products$.subscribe((products) => {
      this.dataSource.data = products;
    });

    this.role$.subscribe((role) => {
      if (role === 'sales') {
        this.displayedColumns = this.displayedColumns.filter(
          (c) => c !== 'price',
        );
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  applyFilters() {
    const filters = { ...this.filterForm.value };

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null && value !== ''),
    );

    this.store.dispatch(ProductsActions.loadProducts({ filters: cleanFilters }));
  }

  onRowClick(product: Product) {
    this.router.navigate(['/catalog/products', product.id]);
  }
}
