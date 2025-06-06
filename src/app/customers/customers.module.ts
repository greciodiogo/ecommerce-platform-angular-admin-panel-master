import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './pages/customers/customers.component';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { MatTableModule } from '@angular/material/table';
import { StoreModule } from '@ngrx/store';
import * as fromUsers from '../users/store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UsersEffects } from '../users/store/effects';

@NgModule({
  declarations: [
    CustomersComponent,
    CustomersListComponent,
    CustomerDetailComponent,
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    MatTableModule,
    StoreModule.forFeature(fromUsers.usersFeatureKey, fromUsers.reducers),
    EffectsModule.forFeature([UsersEffects]),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    SharedModule,
    MatSortModule,
    MatSnackBarModule,
    MatPaginatorModule,
  ],
})
export class CustomersModule {}
