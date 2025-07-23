import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Promotion } from 'src/app/core/api/model/promotion';
import { CreatePromotionFormComponent } from '../create-promotion-form/create-promotion-form.component';
import { Router } from '@angular/router';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { selectPromotionsList } from '../../store/selectors/promotions.selectors';

@Component({
  selector: 'app-promotions-cards-page',
  templateUrl: './promotions-cards-page.component.html',
  styleUrls: ['./promotions-cards-page.component.scss']
})
export class PromotionsCardsPageComponent implements OnInit {
  promotions$: Observable<Promotion[]> = this.store.select(selectPromotionsList);

  constructor(private dialog: MatDialog, private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(PromotionsActions.loadPromotions());
  }

  openCreatePromotionDialog(): void {
    this.dialog.open(CreatePromotionFormComponent, {
      width: '500px',
      autoFocus: true
    });
  }

  viewPromotion(promotion: Promotion): void {
    this.router.navigate(['/catalog/promotion', promotion.id]);
  }
} 