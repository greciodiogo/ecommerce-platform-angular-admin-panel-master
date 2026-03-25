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

  create(data: SplashScreenCreateDto): Observable<SplashScreen> {
    return this.http.post<SplashScreen>(this.apiUrl, data);
  }

  update(id: number, data: SplashScreenUpdateDto): Observable<SplashScreen> {
    return this.http.patch<SplashScreen>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  reorder(ids: number[]): Observable<SplashScreen[]> {
    return this.http.put<SplashScreen[]>(`${this.apiUrl}/reorder`, { ids });
  }
}
