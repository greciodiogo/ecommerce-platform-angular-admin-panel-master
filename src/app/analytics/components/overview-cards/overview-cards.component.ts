import { Component, Input } from '@angular/core';
import { OverviewMetrics } from '../../models/analytics.model';

@Component({
  selector: 'app-overview-cards',
  templateUrl: './overview-cards.component.html',
  styleUrls: ['./overview-cards.component.scss'],
})
export class OverviewCardsComponent {
  @Input() metrics: OverviewMetrics | null = null;

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatPercentage(num: number): string {
    return (num * 100).toFixed(0) + '%';
  }

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }
}
