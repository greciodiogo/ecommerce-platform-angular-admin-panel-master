import { Component, Input } from '@angular/core';
import { Order } from '../../../core/api';
import { ReturnAddDialogComponent } from '../return-add-dialog/return-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

interface OrderSourceDetails {
  user_agent?: string;
  platform_type?: string;
  app_version?: string;
  ip_address?: string;
  referer?: string;
}

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent {
  @Input() order: Order | null = null;

  constructor(private dialog: MatDialog, private router: Router) {}

  getSourceDetails(): OrderSourceDetails | null {
    return this.order?.source_details as OrderSourceDetails || null;
  }

  addReturn() {
    const dialogRef = this.dialog.open(ReturnAddDialogComponent, {
      data: {
        orderId: this.order?.id,
      },
      width: '360px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.router.navigate(['/sales/returns']);
      }
    });
  }

  getSourceIcon(source: string): string {
    if (!source) return 'help_outline';
    switch(source.toLowerCase()) {
      case 'android': return 'android';
      case 'ios': return 'phone_iphone';
      case 'web':
      case 'web-chrome':
      case 'web-firefox':
      case 'web-safari':
      case 'web-edge':
        return 'language';
      case 'admin': return 'admin_panel_settings';
      case 'postman':
      case 'insomnia':
        return 'api';
      default: return 'help_outline';
    }
  }

  getSourceLabel(source: string): string {
    if (!source || source === 'unknown') return 'Desconhecido';
    switch(source.toLowerCase()) {
      case 'android': return 'Android App';
      case 'ios': return 'iOS App';
      case 'web': return 'Website';
      case 'web-chrome': return 'Website (Chrome)';
      case 'web-firefox': return 'Website (Firefox)';
      case 'web-safari': return 'Website (Safari)';
      case 'web-edge': return 'Website (Edge)';
      case 'admin': return 'Admin Panel';
      case 'postman': return 'Postman';
      case 'insomnia': return 'Insomnia';
      default: return source;
    }
  }

  getSourceColor(source: string): string {
    if (!source) return '#9E9E9E';
    switch(source.toLowerCase()) {
      case 'android': return '#3DDC84';
      case 'ios': return '#000000';
      case 'web':
      case 'web-chrome':
      case 'web-firefox':
      case 'web-safari':
      case 'web-edge':
        return '#4285F4';
      case 'admin': return '#FF6B6B';
      case 'postman':
      case 'insomnia':
        return '#FF9800';
      default: return '#9E9E9E';
    }
  }
}
