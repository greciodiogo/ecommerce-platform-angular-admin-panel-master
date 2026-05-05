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
    return this.http.get<any>(`${this.baseUrl}/faqs`)
      .pipe(
        map(response => {
          console.log('FAQ API Response:', response);
          
          let allFaqs: any[] = [];
          
          if (response.success && response.data) {
            // The API returns FAQs grouped by category: { account: [...], delivery: [...], etc }
            // We need to flatten this structure
            const categoriesData = response.data;
            
            // Iterate through each category and collect all FAQs
            Object.keys(categoriesData).forEach(categoryKey => {
              const faqsInCategory = categoriesData[categoryKey];
              if (Array.isArray(faqsInCategory)) {
                // Add category to each FAQ if not present
                faqsInCategory.forEach(faq => {
                  if (!faq.category) {
                    faq.category = categoryKey;
                  }
                  allFaqs.push(faq);
                });
              }
            });
          } else if (Array.isArray(response)) {
            allFaqs = response;
          } else if (response.data && Array.isArray(response.data)) {
            allFaqs = response.data;
          }
          
          console.log('FAQ Data to transform:', allFaqs);
          
          // Transform AdonisJS response to match Angular model
          const transformed = allFaqs.map((faq: any) => this.transformFaq(faq));
          console.log('FAQ Transformed:', transformed);
          
          return transformed;
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
    console.log('Transforming FAQ:', faq);
    
    const transformed = {
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      question_en: faq.question_en || undefined,
      answer_en: faq.answer_en || undefined,
      category: faq.category || 'general',
      order: faq.order !== undefined ? faq.order : 0,
      is_active: faq.is_active !== undefined ? faq.is_active : true,
      // Legacy field for backward compatibility
      visible: faq.is_active !== undefined ? faq.is_active : true,
      // Timestamps - AdonisJS doesn't use these, so we provide defaults
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    console.log('Transformed FAQ:', transformed);
    return transformed;
  }
}
