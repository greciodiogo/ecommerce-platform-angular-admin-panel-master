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

  @Input() title: string = "Order Status Distribution";
  @Input() series: number[] = [1];
  @Input() labels: string[] = ["No Data"];

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(){
    this.initChart();
  }

  public initChart(){
    this.chartOptions = {
      series: this.series,
      chart: {
        height: 280,
        type: 'pie',
      },
      labels: this.labels,
      title: {
        text: this.title,
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
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val.toString();
          }
        }
      },
      dataLabels: {
        enabled: true
      }
    };
  }

  ngOnChanges() {
    this.initChart();
  }

  public areas: any = []
  public areaTotalAlocado: any = []
  public areaPercentual: any = []

}
