import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Product, ProductPhoto } from '../../../core/api';
import { FormControl } from '@angular/forms';
import { FileInput } from 'ngx-custom-material-file-input';
import { ProductsActions, selectSelectedProduct } from '../../store';
import { Store } from '@ngrx/store';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { firstValueFrom, of, skipWhile, timeout } from 'rxjs';

@Component({
  selector: 'app-product-photos-input',
  templateUrl: './product-photos-input.component.html',
  styleUrls: ['./product-photos-input.component.scss'],
})
export class ProductPhotosInputComponent implements OnChanges, OnInit {
  @Input() product: Product | null | undefined = null;

  photosToSave = new FormControl<FileInput>(new FileInput([]), {
    nonNullable: true,
  });
  photosToDelete = new FormControl<number[]>([], {
    nonNullable: true,
  });
  photosToDisplay: { name: string; data: string }[] = [];
  newPhotosOrder = new FormControl<number[] | null>(null, {
    nonNullable: true,
  });
  sortedPhotos: ProductPhoto[] = [];

  @Output() dirty = new EventEmitter<void>();
  @Output() pristine = new EventEmitter<void>();

  constructor(private store: Store) {}

  ngOnInit() {
    this.resetValues();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ('product' in changes) {
      this.newPhotosOrder.setValue(
        this.product?.photosOrder
          ? this.product.photosOrder.split(',').map((id) => parseInt(id))
          : null,
      );
      this.updateSortedPhotos();
      this.pristine.emit();
    }
  }

  private updateSortedPhotos() {
    if (!this.product?.photos) {
      this.sortedPhotos = [];
      return;
    }
    const photosOrder = this.newPhotosOrder.value;
    if (!photosOrder) {
      this.sortedPhotos = [...this.product.photos];
      return;
    }
    const photos = [...this.product.photos];
    this.sortedPhotos = photos.sort((a, b) => {
      return photosOrder.indexOf(a.id) - photosOrder.indexOf(b.id);
    });
  }

  updatePhotosToDisplay() {
    this.photosToDisplay = [];
    for (const file of this.photosToSave.value.files) {
      this.photosToDisplay.push({
        name: file.name,
        data: URL.createObjectURL(file),
      });
    }
  }

  removePhoto(name: string) {
    this.photosToSave.setValue(
      new FileInput(
        this.photosToSave.value.files.filter((file) => file.name !== name),
      ),
    );
    this.photosToDisplay = this.photosToDisplay.filter(
      (photo) => photo.name !== name,
    );
    this.dirty.emit();
  }

  markPhotoToDelete(id: number) {
    // Deletar imediatamente ao invés de marcar para deletar depois
    if (!this.product) {
      return;
    }
    
    // Confirmar antes de deletar
    if (confirm('Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.')) {
      this.store.dispatch(
        ProductsActions.deleteProductPhoto({
          productId: this.product.id,
          photoId: id,
        }),
      );
    }
  }

  unmarkPhoto(id: number) {
    // Método não é mais necessário, mas mantido para compatibilidade
    this.photosToDelete.setValue(
      this.photosToDelete.value.filter((photoId) => photoId !== id),
    );
    this.dirty.emit();
  }

  async dropPhoto(event: CdkDragDrop<number, number, number>) {
    if (!this.product?.photos) {
      return;
    }
    const photosOrder =
      this.newPhotosOrder.value ?? this.product.photos.map((photo) => photo.id);
    moveItemInArray(photosOrder, event.previousIndex, event.currentIndex);
    this.newPhotosOrder.setValue(photosOrder);
    this.updateSortedPhotos();
    this.dirty.emit();
  }

  resetValues() {
    this.photosToSave.setValue(new FileInput([]));
    this.photosToDelete.setValue([]);
    this.newPhotosOrder.setValue(
      this.product?.photosOrder
        ? this.product.photosOrder.split(',').map((id) => parseInt(id))
        : null,
    );
    this.updatePhotosToDisplay();
    this.updateSortedPhotos();
    this.pristine.emit();
  }

  public async save() {
    await this.savePhotosOrder();
    await this.savePhotos();
    // deletePhotos() removido - agora a exclusão é imediata
    await this.resetValues();
    this.updateSortedPhotos();
  }

  private async savePhotos() {
    if (!this.product) {
      return;
    }
    for (const file of this.photosToSave.value.files) {
      this.store.dispatch(
        ProductsActions.addProductPhoto({
          productId: this.product.id,
          data: file,
        }),
      );
    }
  }

  // Método deletePhotos() removido - não é mais necessário

  private async savePhotosOrder() {
    if (!this.product) {
      return;
    }
    const newValue = this.newPhotosOrder.value?.join(',');
    this.store.dispatch(
      ProductsActions.updateProduct({
        id: this.product.id,
        data: {
          photosOrder: this.newPhotosOrder.value?.join(','),
        },
      }),
    );
    await firstValueFrom(
      this.store.select(selectSelectedProduct).pipe(
        skipWhile((product) => product?.photosOrder !== newValue),
        timeout({ each: 5000, with: () => of(false) }),
      ),
    );
  }
}
