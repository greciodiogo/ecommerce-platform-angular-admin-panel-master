import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CategoriesComponent } from './pages/categories/categories.component';
import { StoreModule } from '@ngrx/store';

import * as fromCatalog from './store/reducers';
import { ProductsComponent } from './pages/products/products.component';
import { EffectsModule } from '@ngrx/effects';
import {
  AttributeTypesEffects,
  CategoriesEffects,
  FaqsEffects,
  ProductRatingsEffects,
  ProductsEffects,
  ShopsEffects,
} from './store/effects';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { FaqsListComponent } from './pages/faqs-list/faqs-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from '../shared/shared.module';
import { ProductPhotoComponent } from './components/product-photo/product-photo.component';
import { MatIconModule } from '@angular/material/icon';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MaterialFileInputModule } from 'ngx-custom-material-file-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductPhotosInputComponent } from './components/product-photos-input/product-photos-input.component';
import { ProductComponent } from './pages/product/product.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductAttributesComponent } from './components/product-attributes/product-attributes.component';
import { MatDividerModule } from '@angular/material/divider';
import { AttributeTypeCreateDialogComponent } from './components/attribute-type-create-dialog/attribute-type-create-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ProductAttributesAddFormComponent } from './components/product-attributes-add-form/product-attributes-add-form.component';
import { ProductAttributeItemComponent } from './components/product-attribute-item/product-attribute-item.component';
// import { CreateProductFormComponent } from './pages/create-product-form/create-product-form.component';
import { NewProductPhotosInputComponent } from './components/new-product-photos-input/new-product-photos-input.component';
import { CategoriesTreeComponent } from './pages/categories-tree/categories-tree.component';
import { MatTreeModule } from '@angular/material/tree';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { CategoriesProductsAddFormComponent } from './components/categories-products-add-form/categories-products-add-form.component';
import { AuthModule } from '../core/auth/auth.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductRatingsComponent } from './components/product-ratings/product-ratings.component';
import { ProductRatingDetailsComponent } from './components/product-rating-details/product-rating-details.component';
import { CreateFaqFormComponent } from './pages/create-faq-form/create-faq-form.component';
import { CreateProductFormComponent } from './pages/create-product-form/create-product-form.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { FaqComponent } from './pages/faq/faq.component';
import { FaqDetailsComponent } from './components/faq-details/faq-details.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ShopsComponent } from './pages/shops/shops.component';
import { ShopsListComponent } from './pages/shops-list/shops-list.component';
import { CreateShopFormComponent } from './pages/create-shop-form/create-shop-form.component';
import { ShopDetailComponent } from './pages/shop-detail/shop-detail.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    CategoriesComponent,
    ProductsComponent,
    CreateFaqFormComponent,
    ProductsListComponent,
    FaqsComponent,
    FaqsListComponent,
    ProductPhotoComponent,
    ProductDetailsComponent,
    FaqDetailsComponent,
    ProductPhotosInputComponent,
    ProductComponent,
    FaqComponent,
    ProductAttributesComponent,
    AttributeTypeCreateDialogComponent,
    ProductAttributesAddFormComponent,
    ProductAttributeItemComponent,
    CreateProductFormComponent,
    NewProductPhotosInputComponent,
    CategoriesTreeComponent,
    CategoryComponent,
    CategoryDetailsComponent,
    CategoryProductsComponent,
    ProductCardComponent,
    CategoriesProductsAddFormComponent,
    ProductRatingsComponent,
    ProductRatingDetailsComponent,
    ReportsComponent,
    ShopsComponent,
    ShopsListComponent,
    CreateShopFormComponent,
    ShopDetailComponent,
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    StoreModule.forFeature(fromCatalog.catalogFeatureKey, fromCatalog.reducers),
    EffectsModule.forFeature([
      ProductsEffects,
      FaqsEffects,
      ShopsEffects,
      CategoriesEffects,
      AttributeTypesEffects,
      ProductRatingsEffects,
    ]),
    MatCardModule,
    MatTableModule,
    MatSortModule,
    SharedModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MaterialFileInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    MatDividerModule,
    MatDialogModule,
    MatListModule,
    MatTreeModule,
    NgxMatSelectSearchModule,
    AuthModule,
    MatPaginatorModule,
    MatChipsModule,
    MatAutocompleteModule,
    DragDropModule,
    MatSnackBarModule
  ],
  exports: [ProductPhotoComponent],
})
export class CatalogModule {}
