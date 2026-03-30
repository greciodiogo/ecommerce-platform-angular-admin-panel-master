import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SplashScreen {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  order: number;
  duration: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SplashScreenCreateDto {
  title: string;
  description?: string;
  imageUrl: string;
  order?: number;
  duration?: number;
  isActive?: boolean;
}

export interface SplashScreenUpdateDto extends Partial<SplashScreenCreateDto> {}

@Injectable({
  providedIn: 'root',
})
export class SplashScreensService {
  private apiUrl = `${environment.apiUrl}/splash-screens`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<SplashScreen[]> {
    return this.http.get<SplashScreen[]>(this.apiUrl);
  }

  findOne(id: number): Observable<SplashScreen> {
    return this.http.get<SplashScreen>(`${this.apiUrl}/${id}`);
  }

  create(data: FormData): Observable<SplashScreen> {
    return this.http.post<SplashScreen>(this.apiUrl, data);
  }

  update(id: number, data: FormData): Observable<SplashScreen> {
    return this.http.patch<SplashScreen>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteImage(id: number): Observable<SplashScreen> {
    return this.http.delete<SplashScreen>(`${this.apiUrl}/${id}/image`);
  }

  reorder(ids: number[]): Observable<SplashScreen[]> {
    return this.http.put<SplashScreen[]>(`${this.apiUrl}/reorder`, { ids });
  }

  getImageUrl(path?: string): string {
    if (!path) return '';
    const supabaseUrl = 'https://opfiripapiqozvbopcdc.supabase.co/storage/v1/object/public/uploads/';
    return `${supabaseUrl}${path}`;
  }
}
