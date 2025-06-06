import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User, UserUpdateDto } from '../../../core/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersActions } from '../../../users/store';
import { Store } from '@ngrx/store';
import RoleEnum = UserUpdateDto.RoleEnum;
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnInit {
  role$ = this.store.select(selectUserRole);
  
  @Input() customer!: User;

  @Output() cancel = new EventEmitter<void>();

  editForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    firstName: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    lastName: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    role: new FormControl<RoleEnum>('customer', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.resetValues();
  }

  resetValues() {
    this.editForm.setValue({
      email: this.customer.email,
      firstName: this.customer.firstName ?? null,
      lastName: this.customer.lastName ?? null,
      role: this.customer.role,
    });
  }

  save() {
    this.store.dispatch(
      UsersActions.updateUser({
        id: this.customer.id,
        data: {
          email: this.editForm.value.email,
          firstName: this.editForm.value.firstName ?? undefined,
          lastName: this.editForm.value.lastName ?? undefined,
          role: this.editForm.value.role,
        },
      }),
    );
    this.snackBar.open('User updated', '', { duration: 2000 });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete customer',
        message: 'Are you sure you want to delete this customer?',
        confirmButton: 'Delete',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(UsersActions.deleteUser({ id: this.customer.id }));
        this.snackBar.open('User deleted', '', { duration: 2000 });
      }
    });
  }
}
