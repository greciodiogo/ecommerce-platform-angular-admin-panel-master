import { Component, Input } from '@angular/core';
import { Promotion } from '../../../core/api/model/promotion';

@Component({
  selector: 'app-promotion-details',
  templateUrl: './promotion-details.component.html',
  styleUrls: ['./promotion-details.component.scss'],
})
export class PromotionDetailsComponent {
  @Input() promotion: Promotion | null = null;

  getStatusColor(): string {
    if (!this.promotion) return 'warn';
    
    const now = new Date();
    const start = new Date(this.promotion.startDate);
    const end = new Date(this.promotion.endDate);
    
    if (!this.promotion.isActive) return 'warn';
    if (now < start) return 'accent';
    if (now > end) return 'warn';
    return 'primary';
  }

  getStatusText(): string {
    if (!this.promotion) return 'Desconhecido';
    
    const now = new Date();
    const start = new Date(this.promotion.startDate);
    const end = new Date(this.promotion.endDate);
    
    if (!this.promotion.isActive) return 'Inativa';
    if (now < start) return 'Agendada';
    if (now > end) return 'Expirada';
    return 'Ativa';
  }

  getDaysRemaining(): number {
    if (!this.promotion) return 0;
    
    const now = new Date();
    const end = new Date(this.promotion.endDate);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
