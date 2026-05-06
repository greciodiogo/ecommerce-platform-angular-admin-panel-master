import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DownloadMetrics } from '../../models/analytics.model';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexGrid,
  ApexTooltip,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  colors: string[];
};

@Component({
  selector: 'app-downloads-chart',
  templateUrl: './downloads-chart.component.html',
  styleUrls: ['./downloads-chart.component.scss'],
})
export class DownloadsChartComponent implements OnChanges {
  @Input() downloads: DownloadMetrics | null = null;
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions> = {};
  public countryChartOptions: Partial<ChartOptions> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['downloads'] && this.downloads) {
      this.initializeCharts();
    }
  }

  private initializeCharts(): void {
    if (!this.downloads) return;

    // Downloads by Date (Line Chart)
    this.chartOptions = {
      series: [
        {
          name: 'Downloads',
          data: this.downloads.byDate.map((d) => d.count),
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: this.downloads.byDate.map((d) => {
          const date = new Date(d.date);
          return date.toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' });
        }),
        labels: {
          rotate: -45,
          rotateAlways: false,
        },
      },
      yaxis: {
        title: {
          text: 'Downloads',
        },
        labels: {
          formatter: (value) => Math.round(value).toString(),
        },
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy',
        },
      },
      colors: ['#4e73df'],
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
    };

    // Downloads by Country (Bar Chart)
    this.countryChartOptions = {
      series: [
        {
          name: 'Downloads',
          data: this.downloads.byCountry.map((c) => c.count),
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => {
          if (val >= 1000) {
            return (val / 1000).toFixed(1) + 'K';
          }
          return val.toString();
        },
      },
      xaxis: {
        categories: this.downloads.byCountry.map((c) => c.country),
      },
      yaxis: {
        title: {
          text: 'Downloads',
        },
      },
      colors: ['#1cc88a'],
      grid: {
        borderColor: '#e7e7e7',
      },
    };
  }
}
