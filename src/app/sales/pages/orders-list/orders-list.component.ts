import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { OrdersActions, selectOrdersListWithItems } from '../../store';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../../../core/api';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { selectUserRole } from 'src/app/core/auth/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit, AfterViewInit, OnDestroy {
  orders$ = this.store.select(selectOrdersListWithItems);
  dataSource = new MatTableDataSource<Order>();
  private subscription!: Subscription;
  role$ = this.store.select(selectUserRole);
  filterForm: FormGroup;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'order_number',
    'contact',
    'items',
    'total',
    'status',
    'created',
    'actions',
  ];

  constructor(private store: Store, private fb: FormBuilder,
    public router: Router,
    private dialog: MatDialog) {
    this.filterForm = this.fb.group({
      orderNumber: [''],
      date: [''],
      shopName: [''],
      status: [''],
    });
  }

  ngOnInit() {
    this.store.dispatch(OrdersActions.loadOrders({ filters: {} }));

    this.subscription = this.orders$.subscribe((orders) => {
      this.dataSource.data = orders;
    });
  }

  applyFilters() {
    const filters = { ...this.filterForm.value };

    if (filters.date instanceof Date) {
      const date = filters.date as Date;
      // Manually construct the date string in YYYY-MM-DD format to avoid timezone issues.
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      filters.date = `${year}-${month}-${day}`;
    }

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value)
    );

    this.store.dispatch(OrdersActions.loadOrders({ filters: cleanFilters }));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(order: Order) {
    this.router.navigate(['/sales/orders', order.id]);
  }

  updateOrderStatus(order: Order, newStatus: Order.StatusEnum) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to change status to '${newStatus}'?`,
        confirmText: 'Yes',
        cancelText: 'No',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(
          OrdersActions.updateOrder({
            orderId: order.id,
            data: {
              status: newStatus,
            },
          })
        );
      }
    });
  }

  getStatusClass(status: Order.StatusEnum): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'open': return 'status-open';
      case 'delivered': return 'status-delivered';
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      default: return '';
    }
  }
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ data.cancelText || 'Cancel' }}</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="true">{{ data.confirmText || 'OK' }}</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
