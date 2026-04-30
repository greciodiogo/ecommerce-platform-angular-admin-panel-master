import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeliverySetting, DeliverySettingResponse } from '../models/delivery-setting.model';

@Injectable({
  providedIn: 'root'
})
export class DeliverySettingsService {
  private apiUrl = 'https://api.encontrarshopping.com/delivery-settings';

  constructor(private http: HttpClient) {}

  /**
   * Listar todas as configurações de entrega
   */
  getAll(): Observable<DeliverySettingResponse> {
    return this.http.get<DeliverySettingResponse>(this.apiUrl);
  }

  /**
   * Buscar configuração específica por chave
   */
  getByKey(key: string): Observable<DeliverySettingResponse> {
    return this.http.get<DeliverySettingResponse>(`${this.apiUrl}/${key}`);
  }

  /**
   * Atualizar valor de uma configuração
   */
  update(key: string, value: any): Observable<DeliverySettingResponse> {
    return this.http.put<DeliverySettingResponse>(
      `${this.apiUrl}/${key}`,
      { value }
    );
  }
}
