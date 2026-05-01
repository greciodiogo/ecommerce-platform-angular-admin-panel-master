import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchTag, SearchTagResponse } from '../models/search-tag.model';

@Injectable({
  providedIn: 'root'
})
export class SearchTagsService {
  private apiUrl = 'https://api.encontrarshopping.com/search-tags';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SearchTagResponse> {
    return this.http.get<SearchTagResponse>(this.apiUrl);
  }

  getById(id: number): Observable<SearchTagResponse> {
    return this.http.get<SearchTagResponse>(`${this.apiUrl}/${id}`);
  }

  create(tag: Partial<SearchTag>): Observable<SearchTagResponse> {
    return this.http.post<SearchTagResponse>(this.apiUrl, tag);
  }

  update(id: number, tag: Partial<SearchTag>): Observable<SearchTagResponse> {
    return this.http.patch<SearchTagResponse>(`${this.apiUrl}/${id}`, tag);
  }

  delete(id: number): Observable<SearchTagResponse> {
    return this.http.delete<SearchTagResponse>(`${this.apiUrl}/${id}`);
  }

  reorder(ids: number[]): Observable<SearchTagResponse> {
    return this.http.put<SearchTagResponse>(`${this.apiUrl}/reorder`, { ids });
  }
}
