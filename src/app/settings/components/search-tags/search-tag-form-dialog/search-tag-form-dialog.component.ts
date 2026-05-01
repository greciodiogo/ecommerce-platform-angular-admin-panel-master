import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchTagsService } from '../../../services/search-tags.service';
import { SearchTag } from '../../../models/search-tag.model';

@Component({
  selector: 'app-search-tag-form-dialog',
  templateUrl: './search-tag-form-dialog.component.html',
  styleUrls: ['./search-tag-form-dialog.component.scss']
})
export class SearchTagFormDialogComponent implements OnInit {
  form: FormGroup;
  saving = false;
  isEditMode = false;

  // Material Icons comuns para tags de pesquisa
  commonIcons = [
    'phone_iphone', 'smartphone', 'laptop', 'headphones', 'tv',
    'camera_alt', 'sports_esports', 'watch', 'tablet', 'cable',
    'computer', 'keyboard', 'mouse', 'speaker', 'memory',
    'router', 'print', 'scanner', 'videocam', 'mic'
  ];

  constructor(
    private fb: FormBuilder,
    private searchTagsService: SearchTagsService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SearchTagFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SearchTag | null
  ) {
    this.isEditMode = !!data;
    
    this.form = this.fb.group({
      tag: ['', [Validators.required, Validators.maxLength(100)]],
      icon: [''],
      color: ['#2196F3'],
      order: [0, [Validators.min(0)]],
      active: [true]
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
      ? this.searchTagsService.update(this.data!.id, formData)
      : this.searchTagsService.create(formData);

    observable.subscribe({
      next: (response) => {
        if (response.success) {
          const message = this.isEditMode 
            ? 'Tag atualizada com sucesso!' 
            : 'Tag criada com sucesso!';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.dialogRef.close(true);
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Erro ao salvar tag:', error);
        this.snackBar.open('Erro ao salvar tag', 'Fechar', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
