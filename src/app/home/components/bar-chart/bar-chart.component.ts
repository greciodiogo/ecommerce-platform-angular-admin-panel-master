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

    @Input() title: string = "Movimentos em Stock"

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    this.initConfig()
  }

  public initConfig(){
    this.chartOptions = {
      series: [{
      name: 'Entrada',
      data: [56, 61, 58, 63, 60, 66],
      color: '#3f51b5'
    }, {
      name: 'Saídas',
      data: [98, 87, 105, 91, 114, 94],
      color: '#022213'
    },
  ],
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
      categories: ['Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'],
    },
    yaxis: {
      title: {
        text: ' (000 Kwanzas)'
      }
    },
    fill: {
      colors: ['#15283c', '#ff5722', '#214162'],
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "" + val + " KZ"
        }
      }
    }
    };
  }

  public ngOnInit(){
  }
  
  public totais: any = []
  public months: any = []
  public areaPercentual: any = []

}
