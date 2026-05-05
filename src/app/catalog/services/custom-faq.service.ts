import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Faq, FaqCreateDto, FaqUpdateDto } from '../../core/api';

/**
 * Custom FAQ Service that connects to encontrarCore API (portal-api)
 * instead of the default ecommerce-api (NestJS)
 */
@Injectable({
  providedIn: 'root'
})
export class CustomFaqService {
  private readonly baseUrl = 'https://portal-api.encontrarshopping.com/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all FAQs
   */
  getFaqs(): Observable<Faq[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.baseUrl}/faqs`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Transform AdonisJS response to match Angular model
            return response.data.map(faq => this.transformFaq(faq));
          }
          return [];
        })
      );
  }

  /**
   * Get single FAQ by ID
   */
  getFaq(id: number): Observable<Faq> {
    return this.http.get<{ success: boolean; data: any }>(`${this.baseUrl}/faqs/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformFaq(response.data);
          }
          throw new Error('FAQ not found');
        })
      );
  }

  /**
   * Create new FAQ
   */
  createFaq(data: FaqCreateDto): Observable<Faq> {
    return this.http.post<{ success: boolean; data: any }>(`${this.baseUrl}/faqs`, data)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformFaq(response.data);
          }
          throw new Error('Failed to create FAQ');
        })
      );
  }

  /**
   * Update existing FAQ
   */
  updateFaq(id: number, data: FaqUpdateDto): Observable<Faq> {
    return this.http.put<{ success: boolean; data: any }>(`${this.baseUrl}/faqs/${id}`, data)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformFaq(response.data);
          }
          throw new Error('Failed to update FAQ');
        })
      );
  }

  /**
   * Delete FAQ
   */
  deleteFaq(id: number): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/faqs/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error('Failed to delete FAQ');
          }
        })
      );
  }

  /**
   * Transform AdonisJS FAQ response to Angular model
   * Maps snake_case to camelCase and handles field differences
   */
  private transformFaq(faq: any): Faq {
    return {
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      question_en: faq.question_en || undefined,
      answer_en: faq.answer_en || undefined,
      category: faq.category || 'general',
      order: faq.order || 0,
      is_active: faq.is_active !== undefined ? faq.is_active : true,
      // Legacy field for backward compatibility
      visible: faq.is_active !== undefined ? faq.is_active : true,
      // Timestamps - AdonisJS doesn't use these, so we provide defaults
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
  }
}
