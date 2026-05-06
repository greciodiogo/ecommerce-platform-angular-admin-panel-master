import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnalyticsData, AnalyticsPeriod } from '../models/analytics.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  /**
   * Get analytics data
   */
  getAnalytics(
    period: AnalyticsPeriod = AnalyticsPeriod.WEEKLY,
    startDate?: string,
    endDate?: string
  ): Observable<AnalyticsData> {
    let params = new HttpParams().set('period', period);

    if (startDate) {
      params = params.set('startDate', startDate);
    }

    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<AnalyticsData>(this.apiUrl, { params });
  }

  /**
   * Get reviews
   */
  getReviews(maxResults: number = 50): Observable<any[]> {
    const params = new HttpParams().set('maxResults', maxResults.toString());
    return this.http.get<any[]>(`${this.apiUrl}/reviews`, { params });
  }

  /**
   * Reply to a review
   */
  replyToReview(reviewId: string, replyText: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiUrl}/reviews/${reviewId}/reply`,
      { replyText }
    );
  }
}
