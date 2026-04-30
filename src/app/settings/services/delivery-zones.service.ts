import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeliveryZone, PaginatedResponse, DeliveryZoneResponse } from '../models/delivery-zone.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryZonesService {
  private apiUrl = 'https://api.encontrarshopping.com/address';

  constructor(private http: HttpClient) {}

  /**
   * Listar todos os endereços/zonas com filtros e paginação
   */
  getAll(params?: {
    page?: number;
    perPage?: number;
    search?: string;
    hasGps?: boolean;
    isZone?: boolean;
  }): Observable<PaginatedResponse<DeliveryZone>> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.perPage) httpParams = httpParams.set('perPage', params.perPage.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.hasGps !== undefined) httpParams = httpParams.set('hasGps', params.hasGps.toString());
      if (params.isZone !== undefined) httpParams = httpParams.set('isZone', params.isZone.toString());
    }

    return this.http.get<PaginatedResponse<DeliveryZone>>(this.apiUrl, { params: httpParams });
  }

  /**
   * Buscar endereço/zona específico por ID
   */
  getById(id: number): Observable<DeliveryZoneResponse> {
    return this.http.get<DeliveryZoneResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo endereço/zona
   */
  create(zone: Partial<DeliveryZone>): Observable<DeliveryZoneResponse> {
    return this.http.post<DeliveryZoneResponse>(this.apiUrl, zone);
  }

  /**
   * Atualizar endereço/zona existente
   */
  update(id: number, zone: Partial<DeliveryZone>): Observable<DeliveryZoneResponse> {
    return this.http.patch<DeliveryZoneResponse>(`${this.apiUrl}/${id}`, zone);
  }

  /**
   * Deletar endereço/zona
   */
  delete(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
