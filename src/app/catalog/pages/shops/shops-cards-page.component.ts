import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Shop } from 'src/app/core/api/model/shop';
import { CreateShopFormComponent } from '../create-shop-form/create-shop-form.component';
import { Router } from '@angular/router';
import { selectShopsList, ShopsActions } from '../../store';
import { ProductsListComponent } from '../products-list/products-list.component';

@Component({
  selector: 'app-shops-cards-page',
  templateUrl: './shops-cards-page.component.html',
  styleUrls: ['./shops-cards-page.component.scss']
})
export class ShopsCardsPageComponent implements OnInit {
  
  @ViewChild(ProductsListComponent, { static: true })
  public productsListComponent: ProductsListComponent;
  
  shops$: Observable<Shop[]> = this.store.select(selectShopsList);

  constructor(private dialog: MatDialog, private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(ShopsActions.loadShops());
  }

  openCreateShopDialog(): void {
    this.dialog.open(CreateShopFormComponent, {
      width: '500px',
      autoFocus: true
    });
  }

  viewShop(shop: Shop): void {
    this.productsListComponent.filterForm.patchValue({ shopName: shop.shopName });
    this.productsListComponent.applyFilters();
    this.router.navigate(['/catalog/shops', shop.id]);
  }
} 