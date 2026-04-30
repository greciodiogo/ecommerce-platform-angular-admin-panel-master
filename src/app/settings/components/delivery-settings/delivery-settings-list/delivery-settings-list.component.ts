import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeliverySettingsService } from '../../../services/delivery-settings.service';
import { DeliverySetting } from '../../../models/delivery-setting.model';
import { DeliverySettingsEditDialogComponent } from '../delivery-settings-edit-dialog/delivery-settings-edit-dialog.component';

@Component({
  selector: 'app-delivery-settings-list',
  templateUrl: './delivery-settings-list.component.html',
  styleUrls: ['./delivery-settings-list.component.scss']
})
export class DeliverySettingsListComponent implements OnInit {
  settings: DeliverySetting[] = [];
  loading = false;
  displayedColumns: string[] = ['key', 'value', 'type', 'description', 'actions'];

  constructor(
    private deliverySettingsService: DeliverySettingsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.deliverySettingsService.getAll().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.settings = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar configurações:', error);
        this.snackBar.open('Erro ao carregar configurações', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  editSetting(setting: DeliverySetting): void {
    const dialogRef = this.dialog.open(DeliverySettingsEditDialogComponent, {
      width: '500px',
      data: { ...setting }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSettings();
      }
    });
  }

  getDisplayValue(setting: DeliverySetting): string {
    if (setting.type === 'number') {
      return `${setting.value}`;
    }
    return String(setting.value);
  }

  getKeyLabel(key: string): string {
    const labels: { [key: string]: string } = {
      'delivery.default_fee': 'Taxa Padrão',
      'delivery.extra_km_fee': 'Taxa por Km Extra',
      'delivery.default_radius_km': 'Raio Padrão',
      'delivery.base_location_lat': 'Latitude Base',
      'delivery.base_location_lng': 'Longitude Base',
      'delivery.min_order_for_free_delivery': 'Pedido Mínimo (Entrega Grátis)'
    };
    return labels[key] || key;
  }
}
