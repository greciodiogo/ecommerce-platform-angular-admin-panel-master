import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsData, AnalyticsPeriod } from '../../models/analytics.model';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss'],
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  analyticsData: AnalyticsData | null = null;
  loading = false;
  error: string | null = null;

  selectedPeriod: AnalyticsPeriod = AnalyticsPeriod.WEEKLY;
  periods = [
    { value: AnalyticsPeriod.DAILY, label: 'Daily' },
    { value: AnalyticsPeriod.WEEKLY, label: 'Weekly' },
    { value: AnalyticsPeriod.MONTHLY, label: 'Monthly' },
    { value: AnalyticsPeriod.YEARLY, label: 'Yearly' },
  ];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService
      .getAnalytics(this.selectedPeriod)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.analyticsData = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load analytics data. Please try again.';
          this.loading = false;
          console.error('Analytics error:', err);
        },
      });
  }

  onPeriodChange(period: AnalyticsPeriod): void {
    this.selectedPeriod = period;
    this.loadAnalytics();
  }

  refreshData(): void {
    this.loadAnalytics();
  }

  getDataSourceBadgeClass(): string {
    if (!this.analyticsData) return 'badge-secondary';

    switch (this.analyticsData.dataSource) {
      case 'play-console':
        return 'badge-success';
      case 'firebase':
        return 'badge-info';
      case 'mock':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  getDataSourceLabel(): string {
    if (!this.analyticsData) return 'Unknown';

    switch (this.analyticsData.dataSource) {
      case 'play-console':
        return 'Google Play Console';
      case 'firebase':
        return 'Firebase Analytics';
      case 'mock':
        return 'Mock Data';
      default:
        return 'Unknown';
    }
  }
}
