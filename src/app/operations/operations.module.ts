import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponent } from './pages/operations/operations.component';
import { LogsListComponent } from './components/logs-list/logs-list.component';
import { LogDetailComponent } from './components/log-detail/log-detail.component';
import { MatTableModule } from '@angular/material/table';
import { StoreModule } from '@ngrx/store';
import * as fromOperations from './store/reducers';
import { OperationsEffects } from './store/effects/operations.effects';
import { EffectsModule } from '@ngrx/effects';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    OperationsComponent,
    LogsListComponent,
    LogDetailComponent,
  ],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    MatTableModule,
    StoreModule.forFeature(fromOperations.operationsFeatureKey, fromOperations.reducers),
    EffectsModule.forFeature([OperationsEffects]),
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
export class OperationsModule {} 