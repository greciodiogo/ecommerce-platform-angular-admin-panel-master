import { Component } from '@angular/core';
import { FnService } from 'src/app/services/fn.helper.service';

@Component({
  selector: 'app-index',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  dataJson = [
    {
      "id": 1,
      "name": "Macbook Pro ",
      "price": 3.5,
      "created_at": "2025-04-18",
    },
  ]
  public dashboard: any = {
    facturas: 0,
    clientes: 0,
    produtos: 0,
    recibos: 0,
    servicos:0,
    vendas:0
  };

  constructor(public configService: FnService) {}

  
}
