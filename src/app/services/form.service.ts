import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private route: string = `form`;
  constructor() { }


public getFilterExcel(filtro) {
    return Object.keys(filtro).map(key => ({
      name: key,
      value: filtro[key]
    }));
  }

}