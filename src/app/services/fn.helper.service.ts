
import { EventEmitter, Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class FnService {
  public alertEvent = new EventEmitter();
  regexNumero = /^[0-9]+$/;

  constructor() { }


public numberFormat(number) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    })
      .format(number)
      .replace('€', '')
      .trim();
  }

  public  formatarQuantidade(numero) {
    // Converte o número para uma string
    let numeroFormatado = numero.toString();
    // Adiciona o separador de milhares
    numeroFormatado = numeroFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return numeroFormatado;
  }

}