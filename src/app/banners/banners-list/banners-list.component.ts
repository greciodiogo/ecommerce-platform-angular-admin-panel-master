import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BannersService, Banner } from '../banners.service';

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.scss'],
})
export class BannersListComponent implements OnInit {
  banners: Banner[] = [];
  displayedColumns: string[] = ['image', 'title', 'linkUrl', 'order', 'isActive', 'actions'];
  loading = false;

  constructor(
    private bannersService: BannersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.loading = true;
    this.bannersService.findAll().subscribe({
      next: (data) => {
        this.banners = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar banners:', error);
        this.loading = false;
      },
    });
  }

  getImageUrl(banner: Banner): string {
    // Prioriza imagem PT, depois EN
    const path = banner.imageUrlPt || banner.imageUrlEn;
    return path ? this.bannersService.getImageUrl(path) : '';
  }

  drop(event: CdkDragDrop<Banner[]>): void {
    moveItemInArray(this.banners, event.previousIndex, event.currentIndex);
    const ids = this.banners.map(b => b.id);
    this.bannersService.reorder(ids).subscribe({
      next: (data) => {
        this.banners = data;
      },
      error: (error) => {
        console.error('Erro ao reordenar:', error);
        this.loadBanners();
      },
    });
  }

  toggleActive(banner: Banner): void {
    this.bannersService.toggleActive(banner.id).subscribe({
      next: () => {
        this.loadBanners();
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
      },
    });
  }

  edit(id: number): void {
    this.router.navigate(['/banners', id]);
  }

  delete(id: number): void {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      this.bannersService.remove(id).subscribe({
        next: () => {
          this.loadBanners();
        },
        error: (error) => {
          console.error('Erro ao excluir:', error);
        },
      });
    }
  }

  createNew(): void {
    this.router.navigate(['/banners/new']);
  }
}
