import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeliveryZonesService } from '../../../services/delivery-zones.service';
import { DeliveryZone } from '../../../models/delivery-zone.model';
import { DeliveryZoneFormDialogComponent } from '../delivery-zone-form-dialog/delivery-zone-form-dialog.component';

@Component({
  selector: 'app-delivery-zones-list',
  templateUrl: './delivery-zones-list.component.html',
  styleUrls: ['./delivery-zones-list.component.scss']
})
export class DeliveryZonesListComponent implements OnInit {
  zones: DeliveryZone[] = [];
  loading = false;
  totalZones = 0;
  pageSize = 20;
  currentPage = 1;
  
  searchControl = new FormControl('');
  hasGpsFilter = new FormControl(false);
  isZoneFilter = new FormControl(false);
  
  displayedColumns: string[] = ['name', 'price', 'gps', 'radius_km', 'is_zone', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private deliveryZonesService: DeliveryZonesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadZones();
    
    // Busca com debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadZones();
      });
    
    // Filtros
    this.hasGpsFilter.valueChanges.subscribe(() => this.loadZones());
    this.isZoneFilter.valueChanges.subscribe(() => this.loadZones());
  }

  loadZones(): void {
    this.loading = true;
    
    const params = {
      page: this.currentPage,
      perPage: this.pageSize,
      search: this.searchControl.value || undefined,
      hasGps: this.hasGpsFilter.value || undefined,
      isZone: this.isZoneFilter.value || undefined
    };

    this.deliveryZonesService.getAll(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.zones = response.data.data;
          this.totalZones = response.data.total;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar zonas:', error);
        this.snackBar.open('Erro ao carregar zonas', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadZones();
  }

  addZone(): void {
    const dialogRef = this.dialog.open(DeliveryZoneFormDialogComponent, {
      width: '700px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZones();
      }
    });
  }

  editZone(zone: DeliveryZone): void {
    const dialogRef = this.dialog.open(DeliveryZoneFormDialogComponent, {
      width: '700px',
      data: { ...zone }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZones();
      }
    });
  }

  deleteZone(zone: DeliveryZone): void {
    if (confirm(`Tem certeza que deseja deletar a zona "${zone.name}"?`)) {
      this.deliveryZonesService.delete(zone.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Zona deletada com sucesso!', 'Fechar', { duration: 3000 });
            this.loadZones();
          }
        },
        error: (error) => {
          console.error('Erro ao deletar zona:', error);
          this.snackBar.open('Erro ao deletar zona', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  hasGps(zone: DeliveryZone): boolean {
    return zone.latitude !== null && zone.latitude !== undefined &&
           zone.longitude !== null && zone.longitude !== undefined;
  }

  getGpsDisplay(zone: DeliveryZone): string {
    if (this.hasGps(zone)) {
      return `${zone.latitude?.toFixed(4)}, ${zone.longitude?.toFixed(4)}`;
    }
    return '-';
  }
}
