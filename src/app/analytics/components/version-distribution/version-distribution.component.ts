import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { VersionMetrics } from '../../models/analytics.model';
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
  selector: 'app-version-distribution',
  templateUrl: './version-distribution.component.html',
  styleUrls: ['./version-distribution.component.scss'],
})
export class VersionDistributionComponent implements OnChanges {
  @Input() versions: VersionMetrics | null = null;
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<PieChartOptions> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['versions'] && this.versions) {
      this.initializeChart();
    }
  }

  private initializeChart(): void {
    if (!this.versions) return;

    this.chartOptions = {
      series: this.versions.distribution.map((v) => v.percentage),
      chart: {
        type: 'pie',
        height: 350,
      },
      labels: this.versions.distribution.map((v) => `v${v.version}`),
      colors: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
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
          expandOnClick: true,
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
}
