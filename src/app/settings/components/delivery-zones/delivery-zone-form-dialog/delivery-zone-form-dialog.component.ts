import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeliveryZonesService } from '../../../services/delivery-zones.service';
import { DeliveryZone } from '../../../models/delivery-zone.model';

@Component({
  selector: 'app-delivery-zone-form-dialog',
  templateUrl: './delivery-zone-form-dialog.component.html',
  styleUrls: ['./delivery-zone-form-dialog.component.scss']
})
export class DeliveryZoneFormDialogComponent implements OnInit {
  form: FormGroup;
  saving = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private deliveryZonesService: DeliveryZonesService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DeliveryZoneFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeliveryZone | null
  ) {
    this.isEditMode = !!data;
    
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      latitude: [''],
      longitude: [''],
      radius_km: [5, [Validators.min(0)]],
      is_zone: [false],
      visible: [true]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      return;
    }

    this.saving = true;
    const formData = this.form.value;

    const observable = this.isEditMode
      ? this.deliveryZonesService.update(this.data!.id, formData)
      : this.deliveryZonesService.create(formData);

    observable.subscribe({
      next: (response) => {
        if (response.success) {
          const message = this.isEditMode 
            ? 'Zona atualizada com sucesso!' 
            : 'Zona criada com sucesso!';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.dialogRef.close(true);
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Erro ao salvar zona:', error);
        this.snackBar.open('Erro ao salvar zona', 'Fechar', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
