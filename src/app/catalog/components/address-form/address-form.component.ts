import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../../core/api/model/address';
import { CreateAddressDto } from '../../../core/api/model/create-address-dto';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnInit {
  @Input() address?: Address;
  @Input() addresses: Address[] = [];
  @Input() allowDelete = false;
  @Output() formSubmit = new EventEmitter<CreateAddressDto>();
  @Output() delete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.address?.name || '', Validators.required],
      slug: [this.address?.slug || ''],
      visible: [this.address?.visible ?? true],
      parentAddressId: [this.address?.parentAddress?.id || null],
    });
  }

  submit() {
    if (this.form.valid) {
      const { name, slug, visible, parentAddressId } = this.form.value;
      const data: CreateAddressDto = { name, slug, visible };
      if (parentAddressId) {
        (data as any).parentAddressId = parentAddressId;
      }
      this.formSubmit.emit(data);
    }
  }

  resetValues() {
    this.form.reset({
      name: this.address?.name || '',
      slug: this.address?.slug || '',
      visible: this.address?.visible ?? true,
      parentAddressId: this.address?.parentAddress?.id || null,
    });
    this.cancel.emit();
  }

  onDelete() {
    this.delete.emit();
  }
} 