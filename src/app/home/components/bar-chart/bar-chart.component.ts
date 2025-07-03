import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexXAxis,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'grafico-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  public movimentos: any
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input() title: string = "Order Count by Period";
  @Input() series: number[] = [0];
  @Input() labels: string[] = ["No Data"];

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(){
    this.initConfig();
  }

  public initConfig(){
    this.chartOptions = {
      series: [{
        name: 'Orders',
        data: this.series,
        color: '#3f51b5'
      }],
      chart: {
        type: 'bar',
        height: 270
      },
      dataLabels: {
        enabled: false,
        style: {
          colors: ['#15283c', '#ff5722', '#214162'],
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: this.labels,
      },
      yaxis: {
        title: {
          text: 'Orders'
        }
      },
      fill: {
        colors: ['#15283c', '#ff5722', '#214162'],
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toString() + " Orders"
          }
        }
      }
    };
  }

  ngOnChanges() {
    this.initConfig();
  }

  public totais: any = []
  public months: any = []
  public areaPercentual: any = []

}
