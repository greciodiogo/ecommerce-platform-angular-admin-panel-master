import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrlPt?: string;
  imageUrlEn?: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BannerCreateDto {
  title: string;
  description?: string;
  linkUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface BannerUpdateDto extends Partial<BannerCreateDto> {}

@Injectable({
  providedIn: 'root',
})
export class BannersService {
  private apiUrl = `${environment.apiUrl}/banners`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.apiUrl, { withCredentials: true });
  }

  findOne(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(data: FormData): Observable<Banner> {
    return this.http.post<Banner>(this.apiUrl, data, { withCredentials: true });
  }

  update(id: number, data: FormData): Observable<Banner> {
    return this.http.patch<Banner>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  toggleActive(id: number): Observable<Banner> {
    return this.http.patch<Banner>(`${this.apiUrl}/${id}/toggle`, {}, { withCredentials: true });
  }

  reorder(ids: number[]): Observable<Banner[]> {
    return this.http.put<Banner[]>(`${this.apiUrl}/reorder`, { ids }, { withCredentials: true });
  }

  deleteImage(id: number, lang: 'pt' | 'en'): Observable<Banner> {
    return this.http.delete<Banner>(`${this.apiUrl}/${id}/image/${lang}`, { withCredentials: true });
  }

  getImageUrl(path?: string): string {
    if (!path) return '';
    const supabaseUrl = 'https://opfiripapiqozvbopcdc.supabase.co/storage/v1/object/public/uploads/';
    return `${supabaseUrl}${path}`;
  }
}
