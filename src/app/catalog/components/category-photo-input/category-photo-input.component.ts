import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Category, CategoryPhoto } from '../../../core/api';
import { FormControl } from '@angular/forms';
import { FileInput } from 'ngx-custom-material-file-input';
import { CategoriesActions, selectSelectedCategory } from '../../store';
import { Store } from '@ngrx/store';
import { firstValueFrom, of, skipWhile, timeout } from 'rxjs';

@Component({
  selector: 'app-category-photo-input',
  templateUrl: './category-photo-input.component.html',
  styleUrls: ['./category-photo-input.component.scss'],
})
export class CategoryPhotoInputComponent implements OnChanges, OnInit {
  @Input() category: Category | null | undefined = null;

  photosToSave = new FormControl<FileInput>(new FileInput([]), {
    nonNullable: true,
  });
  photosToDisplay: { name: string; data: string }[] = [];

  @Output() dirty = new EventEmitter<void>();
  @Output() pristine = new EventEmitter<void>();

  constructor(private store: Store) {}

  ngOnInit() {
    this.resetValues();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ('product' in changes) {
      this.pristine.emit();
    }
  }

  updatePhotosToDisplay() {
    this.photosToDisplay = [];
    for (const file of this.photosToSave.value.files) {
      this.photosToDisplay.push({
        name: file.name,
        data: URL.createObjectURL(file),
      });
    }
    
    // Emitir dirty quando há fotos para salvar
    if (this.photosToSave.value.files.length > 0) {
      this.dirty.emit();
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

  deleteCategoryPhoto(id: number) {
    if (!this.category) {
      return;
    }
    
    // Confirmar antes de deletar
    if (confirm('Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.')) {
      this.store.dispatch(
        CategoriesActions.deleteCategoryPhoto({
          categoryId: this.category.id,
          photoId: id,
        }),
      );
    }
  }

  getCategoryPhotoUrl(categoryId: number, photoId: number, thumbnail: boolean = true): string {
    const baseUrl = 'http://localhost:3000'; // TODO: usar variável de ambiente
    const thumbnailParam = thumbnail ? '?thumbnail=true' : '';
    return `${baseUrl}/categories/${categoryId}/photos/${photoId}${thumbnailParam}`;
  }

  resetValues() {
    this.photosToSave.setValue(new FileInput([]));
    this.updatePhotosToDisplay();
    this.pristine.emit();
  }

  public async save() {
    await this.savePhotos();
    await this.resetValues();
  }

  private async savePhotos() {
    if (!this.category) {
      return;
    }
    for (const file of this.photosToSave.value.files) {
      this.store.dispatch(
        CategoriesActions.addCategoryPhoto({
          categoryId: this.category.id,
          data: file,
        }),
      );
    }
  }
}
