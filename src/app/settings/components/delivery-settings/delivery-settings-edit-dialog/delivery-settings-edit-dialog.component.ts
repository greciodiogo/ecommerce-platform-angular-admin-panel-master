import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeliverySettingsService } from '../../../services/delivery-settings.service';
import { DeliverySetting } from '../../../models/delivery-setting.model';

@Component({
  selector: 'app-delivery-settings-edit-dialog',
  templateUrl: './delivery-settings-edit-dialog.component.html',
  styleUrls: ['./delivery-settings-edit-dialog.component.scss']
})
export class DeliverySettingsEditDialogComponent implements OnInit {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private deliverySettingsService: DeliverySettingsService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DeliverySettingsEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeliverySetting
  ) {
    this.form = this.fb.group({
      value: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      value: this.data.value
    });

    // Adicionar validação específica para números
    if (this.data.type === 'number') {
      this.form.get('value')?.setValidators([Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]);
    }
  }

  getKeyLabel(): string {
    const labels: { [key: string]: string } = {
      'delivery.default_fee': 'Taxa Padrão',
      'delivery.extra_km_fee': 'Taxa por Km Extra',
      'delivery.default_radius_km': 'Raio Padrão',
      'delivery.base_location_lat': 'Latitude Base',
      'delivery.base_location_lng': 'Longitude Base',
      'delivery.min_order_for_free_delivery': 'Pedido Mínimo (Entrega Grátis)'
    };
    return labels[this.data.key] || this.data.key;
  }

  getInputType(): string {
    return this.data.type === 'number' ? 'number' : 'text';
  }

  getUnit(): string {
    const units: { [key: string]: string } = {
      'delivery.default_fee': 'Kz',
      'delivery.extra_km_fee': 'Kz/km',
      'delivery.default_radius_km': 'km',
      'delivery.min_order_for_free_delivery': 'Kz'
    };
    return units[this.data.key] || '';
  }

  onSave(): void {
    if (this.form.invalid) {
      return;
    }

    this.saving = true;
    let value = this.form.value.value;

    // Converter para número se necessário
    if (this.data.type === 'number') {
      value = parseFloat(value);
    }

    this.deliverySettingsService.update(this.data.key, value).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Configuração atualizada com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(true);
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar configuração:', error);
        this.snackBar.open('Erro ao atualizar configuração', 'Fechar', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
