import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SplashScreensService, SplashScreen } from '../splash-screens.service';

@Component({
  selector: 'app-splash-screens-list',
  templateUrl: './splash-screens-list.component.html',
  styleUrls: ['./splash-screens-list.component.scss'],
})
export class SplashScreensListComponent implements OnInit {
  splashScreens: SplashScreen[] = [];
  displayedColumns: string[] = ['image', 'title', 'duration', 'order', 'isActive', 'actions'];
  loading = false;

  constructor(
    private splashScreensService: SplashScreensService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSplashScreens();
  }

  loadSplashScreens(): void {
    this.loading = true;
    this.splashScreensService.findAll().subscribe({
      next: (data) => {
        this.splashScreens = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar splash screens:', error);
        this.loading = false;
      },
    });
  }

  drop(event: CdkDragDrop<SplashScreen[]>): void {
    moveItemInArray(this.splashScreens, event.previousIndex, event.currentIndex);
    const ids = this.splashScreens.map(s => s.id);
    this.splashScreensService.reorder(ids).subscribe({
      next: (data) => {
        this.splashScreens = data;
      },
      error: (error) => {
        console.error('Erro ao reordenar:', error);
        this.loadSplashScreens();
      },
    });
  }

  toggleActive(splashScreen: SplashScreen): void {
    this.splashScreensService.update(splashScreen.id, {
      isActive: !splashScreen.isActive,
    }).subscribe({
      next: () => {
        this.loadSplashScreens();
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
      },
    });
  }

  edit(id: number): void {
    this.router.navigate(['/splash-screens', id]);
  }

  delete(id: number): void {
    if (confirm('Tem certeza que deseja excluir este splash screen?')) {
      this.splashScreensService.remove(id).subscribe({
        next: () => {
          this.loadSplashScreens();
        },
        error: (error) => {
          console.error('Erro ao excluir:', error);
        },
      });
    }
  }

  createNew(): void {
    this.router.navigate(['/splash-screens/new']);
  }
}
