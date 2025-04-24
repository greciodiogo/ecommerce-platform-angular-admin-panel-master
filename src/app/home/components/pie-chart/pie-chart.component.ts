import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexXAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: any;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  forecastDataPoints: any;
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'grafico-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit{
  public movimentos: any[] = []
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

    @Input() title: string = "Order History"
  
  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    this.initChart()
  }

  public initChart(){
    this.chartOptions = {
      series: [{
      name: 'Vendas',
      data: [4, 3, 10, 9, 29, 19]
    }],
      chart: {
      height: 280,
      type: 'line',
    },
    forecastDataPoints: {
      count: 7
    },
    stroke: {
      width: 5,
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '9/11/2000'],
      tickAmount: 10,
      labels: {
        formatter: function(value, timestamp, opts) {
          return opts.dateFormatter(new Date(timestamp), 'dd MMM')
        }
      }
    },
    title: {
      text: 'Forecast',
      align: 'left',
      style: {
        fontSize: "16px",
        color: '#666'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [ '#1D8A4F'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      },
    }
    };
  }

  public ngOnInit(){
  }

  public areas: any = []
  public areaTotalAlocado: any = []
  public areaPercentual: any = []

}
