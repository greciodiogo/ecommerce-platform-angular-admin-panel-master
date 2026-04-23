import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Promotion } from '../../../core/api/model/promotion';
import { Product } from '../../../core/api/model/product';
import * as PromotionsActions from '../../store/actions/promotions.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'app-promotion-products',
  templateUrl: './promotion-products.component.html',
  styleUrls: ['./promotion-products.component.scss'],
})
export class PromotionProductsComponent implements OnInit {
  @Input() promotion: Promotion | null = null;
  
  displayedColumns: string[] = ['id', 'name', 'price', 'promotionalPrice', 'discount', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    if (this.promotion?.products) {
      this.dataSource.data = this.promotion.products;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.promotion?.products) {
      this.dataSource.data = this.promotion.products;
    }
  }

  getPromotionalPrice(product: Product): number {
    if (!this.promotion) return product.price;
    const discount = this.promotion.discount / 100;
    return Math.round(product.price * (1 - discount));
  }

  getDiscountAmount(product: Product): number {
    return product.price - this.getPromotionalPrice(product);
  }

  removeProduct(productId: number) {
    if (!this.promotion) return;
    
    const confirmed = confirm('Tem certeza que deseja remover este produto da promoção?');
    if (!confirmed) return;
    
    this.store.dispatch(
      PromotionsActions.removePromotionProduct({
        promotionId: this.promotion.id,
        productId,
      })
    );
  }

  addProduct() {
    if (!this.promotion) return;
    
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '600px',
      data: {
        promotionId: this.promotion.id,
        existingProductIds: this.promotion.products?.map(p => p.id) || [],
      },
    });

    dialogRef.afterClosed().subscribe((productIds: number[] | undefined) => {
      if (productIds && productIds.length > 0 && this.promotion) {
        // Add each product to the promotion
        productIds.forEach(productId => {
          this.store.dispatch(
            PromotionsActions.addPromotionProduct({
              promotionId: this.promotion!.id,
              productId,
            })
          );
        });
      }
    });
  }
}
