import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { MainComponent } from './pages/main/main.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { EffectsModule } from '@ngrx/effects';
import { ProductsEffects, ShopsEffects } from '../catalog/store/effects';
import * as fromCatalog from './../catalog/store';
import * as fromSales from './../sales/store';
import { OrdersEffects } from '../sales/store/effects';
import { StoreModule } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { DashboardEffects } from '../sales/store/effects/dashboard.effects';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [MainComponent, PieChartComponent, BarChartComponent],
  imports: [
    CommonModule, 
    HomeRoutingModule, 
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    StoreModule.forFeature(
      fromCatalog.catalogFeatureKey, 
      fromCatalog.reducers,
    ),   
     StoreModule.forFeature(
      fromSales.salesFeatureKey, 
      fromSales.reducers
    ), 
    EffectsModule.forFeature([
      ProductsEffects,
      ShopsEffects,
      OrdersEffects,
      DashboardEffects
    ]),
    NgApexchartsModule],
})
export class HomeModule {}
