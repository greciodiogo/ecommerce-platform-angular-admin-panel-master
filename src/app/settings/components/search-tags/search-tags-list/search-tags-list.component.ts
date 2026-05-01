import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SearchTagsService } from '../../../services/search-tags.service';
import { SearchTag } from '../../../models/search-tag.model';
import { SearchTagFormDialogComponent } from '../search-tag-form-dialog/search-tag-form-dialog.component';

@Component({
  selector: 'app-search-tags-list',
  templateUrl: './search-tags-list.component.html',
  styleUrls: ['./search-tags-list.component.scss']
})
export class SearchTagsListComponent implements OnInit {
  tags: SearchTag[] = [];
  loading = false;
  displayedColumns: string[] = ['drag', 'tag', 'icon', 'color', 'clicks', 'active', 'actions'];

  constructor(
    private searchTagsService: SearchTagsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.loading = true;
    this.searchTagsService.getAll().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.tags = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tags:', error);
        this.snackBar.open('Erro ao carregar tags', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  addTag(): void {
    const dialogRef = this.dialog.open(SearchTagFormDialogComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTags();
      }
    });
  }

  editTag(tag: SearchTag): void {
    const dialogRef = this.dialog.open(SearchTagFormDialogComponent, {
      width: '600px',
      data: { ...tag }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTags();
      }
    });
  }

  deleteTag(tag: SearchTag): void {
    if (confirm(`Tem certeza que deseja deletar a tag "${tag.tag}"?`)) {
      this.searchTagsService.delete(tag.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Tag deletada com sucesso!', 'Fechar', { duration: 3000 });
            this.loadTags();
          }
        },
        error: (error) => {
          console.error('Erro ao deletar tag:', error);
          this.snackBar.open('Erro ao deletar tag', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  toggleActive(tag: SearchTag): void {
    this.searchTagsService.update(tag.id, { active: !tag.active }).subscribe({
      next: (response) => {
        if (response.success) {
          tag.active = !tag.active;
          this.snackBar.open('Status atualizado!', 'Fechar', { duration: 2000 });
        }
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
        this.snackBar.open('Erro ao atualizar status', 'Fechar', { duration: 3000 });
      }
    });
  }

  drop(event: CdkDragDrop<SearchTag[]>): void {
    moveItemInArray(this.tags, event.previousIndex, event.currentIndex);
    
    // Atualizar ordem no backend
    const ids = this.tags.map(tag => tag.id);
    this.searchTagsService.reorder(ids).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Ordem atualizada!', 'Fechar', { duration: 2000 });
        }
      },
      error: (error) => {
        console.error('Erro ao reordenar:', error);
        this.snackBar.open('Erro ao reordenar tags', 'Fechar', { duration: 3000 });
        this.loadTags(); // Recarregar em caso de erro
      }
    });
  }
}
