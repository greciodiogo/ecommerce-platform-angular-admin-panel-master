import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { Promotion } from '../../../core/api/model/promotion';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { selectUserRole } from 'src/app/core/auth/store';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { selectPromotionsList } from '../../store/selectors/promotions.selectors';

@Component({
  selector: 'app-promotions-list',
  templateUrl: './promotions-list.component.html',
  styleUrls: ['./promotions-list.component.scss'],
})
export class PromotionsListComponent implements OnInit, AfterViewInit, OnDestroy {
  promotions$ = this.store.select(selectPromotionsList);
  dataSource = new MatTableDataSource<Promotion>();
  subscription!: Subscription;
  role$ = this.store.select(selectUserRole);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: Store) {}

  ngOnInit() {
    this.dataSource.data = [];
    this.store.dispatch(PromotionsActions.loadPromotions());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.dataSource.data = await firstValueFrom(this.promotions$);
    this.subscription = this.promotions$.subscribe((promotions) => {
      this.dataSource.data = promotions;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getStatusColor(promotion: Promotion): string {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    
    if (!promotion.isActive) return 'warn';
    if (now < start) return 'accent';
    if (now > end) return 'warn';
    return 'primary';
  }

  getStatusText(promotion: Promotion): string {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    
    if (!promotion.isActive) return 'Inativa';
    if (now < start) return 'Agendada';
    if (now > end) return 'Expirada';
    return 'Ativa';
  }
}
