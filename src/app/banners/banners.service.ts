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
    return this.http.get<Banner[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.apiUrl}/${id}`);
  }

  create(data: FormData): Observable<Banner> {
    return this.http.post<Banner>(this.apiUrl, data);
  }

  update(id: number, data: FormData): Observable<Banner> {
    return this.http.patch<Banner>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleActive(id: number): Observable<Banner> {
    return this.http.patch<Banner>(`${this.apiUrl}/${id}/toggle`, {});
  }

  reorder(ids: number[]): Observable<Banner[]> {
    return this.http.put<Banner[]>(`${this.apiUrl}/reorder`, { ids });
  }

  deleteImage(id: number, lang: 'pt' | 'en'): Observable<Banner> {
    return this.http.delete<Banner>(`${this.apiUrl}/${id}/image/${lang}`);
  }

  getImageUrl(path?: string): string {
    if (!path) return '';
    const supabaseUrl = 'https://opfiripapiqozvbopcdc.supabase.co/storage/v1/object/public/uploads/';
    return `${supabaseUrl}${path}`;
  }
}
