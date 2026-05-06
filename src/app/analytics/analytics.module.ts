import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsDashboardComponent } from './pages/analytics-dashboard/analytics-dashboard.component';
import { OverviewCardsComponent } from './components/overview-cards/overview-cards.component';
import { DownloadsChartComponent } from './components/downloads-chart/downloads-chart.component';
import { RatingsChartComponent } from './components/ratings-chart/ratings-chart.component';
import { VersionDistributionComponent } from './components/version-distribution/version-distribution.component';
import { AnalyticsService } from './services/analytics.service';

@NgModule({
  declarations: [
    AnalyticsDashboardComponent,
    OverviewCardsComponent,
    DownloadsChartComponent,
    RatingsChartComponent,
    VersionDistributionComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgApexchartsModule,
    AnalyticsRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonToggleModule,
  ],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
