import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { RatingMetrics } from '../../models/analytics.model';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
} from 'ng-apexcharts';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  colors: string[];
};

@Component({
  selector: 'app-ratings-chart',
  templateUrl: './ratings-chart.component.html',
  styleUrls: ['./ratings-chart.component.scss'],
})
export class RatingsChartComponent implements OnChanges {
  @Input() ratings: RatingMetrics | null = null;
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<PieChartOptions> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ratings'] && this.ratings) {
      this.initializeChart();
    }
  }

  private initializeChart(): void {
    if (!this.ratings) return;

    const distribution = this.ratings.distribution;
    const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);

    this.chartOptions = {
      series: [
        distribution[5],
        distribution[4],
        distribution[3],
        distribution[2],
        distribution[1],
      ],
      chart: {
        type: 'donut',
        height: 350,
      },
      labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
      colors: ['#1cc88a', '#36b9cc', '#f6c23e', '#fd7e14', '#e74a3b'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => {
          return val.toFixed(1) + '%';
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontWeight: 600,
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 700,
                formatter: (val: string) => {
                  return val;
                },
              },
              total: {
                show: true,
                label: 'Total Reviews',
                fontSize: '14px',
                fontWeight: 600,
                formatter: () => {
                  return total.toString();
                },
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  getStarArray(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => (i < rating ? 1 : 0));
  }

  getTotalReviews(): number {
    if (!this.ratings) return 1;
    return Object.values(this.ratings.distribution).reduce((sum, val) => sum + val, 0);
  }
}
