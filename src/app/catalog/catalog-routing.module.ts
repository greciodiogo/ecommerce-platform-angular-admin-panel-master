import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { FaqsListComponent } from './pages/faqs-list/faqs-list.component';
import { ProductComponent } from './pages/product/product.component';
import { AuthRoleGuard } from '../core/auth/guards/auth-role.guard';
import { PickTypeClass } from '../core/api';
import RoleEnum = PickTypeClass.RoleEnum;
import { CreateFaqFormComponent } from './pages/create-faq-form/create-faq-form.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoriesTreeComponent } from './pages/categories-tree/categories-tree.component';
import { CreateProductFormComponent } from './pages/create-product-form/create-product-form.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ShopsComponent } from './pages/shops/shops.component';
import { TrendingComponent } from './pages/trending/trending.component';
import { PromotionsComponent } from './pages/promotions/promotions.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { PromotionsListComponent } from './pages/promotions-list/promotions-list.component';
import { CreatePromotionFormComponent } from './pages/create-promotion-form/create-promotion-form.component';
import { AddressesComponent } from './pages/addresses/addresses.component';
import { AddressesTreeComponent } from './pages/addresses-tree/addresses-tree.component';
import { AddressComponent } from './pages/address/address.component';
import { ProductsReportComponent } from './pages/products-report/products-report.component';

const routes: Routes = [
  {
    title: 'Products',
    path: 'products',
    component: ProductsComponent,
    children: [
      {
        title: 'Create new product',
        path: 'new',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
        component: CreateProductFormComponent,
      },
      {
        title: 'Product',
        path: ':id',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
        component: ProductComponent,
      },
      {
        title: 'Products',
        path: '',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
        component: ProductsListComponent,
      },
    ],
  },
  {
    title: 'Faqs',
    path: 'faqs',
    component: FaqsComponent,
    children: [
      {
        title: 'Create new faq',
        path: 'new',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager] },
        component: CreateFaqFormComponent,
      },
      {
        title: 'Faq',
        path: ':id',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager] },
        component: FaqComponent,
      },
      {
        title: 'Faqs',
        path: '',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
        component: FaqsListComponent,
      },
    ],
  },
    {
    title: 'Promotions',
    path: 'promotions',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
    component: PromotionsComponent,
    children: [
      {
        title: 'Create new order',
        path: 'new',
        component: CreatePromotionFormComponent,
      },
      {
        title: 'Promotion',
        path: ':id',
        component: PromotionComponent,
      },
      {
        title: 'Promotions',
        path: '',
        component: PromotionsListComponent,
      },
    ],
  },
  {
    title: 'Categories',
    path: 'categories',
    component: CategoriesComponent,
    children: [
      {
        title: 'Categories',
        path: '',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
        component: CategoriesTreeComponent,
      },
      {
        title: 'Category',
        path: ':id',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager] },
        component: CategoryComponent,
      },
      {
        title: 'Trending Products',
        path: ':id/trending',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager] },
        component: TrendingComponent,
      },
    ],
  },
  {
    title: 'Relatórios',
    path: 'reports',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
    component: ReportsComponent,
  },
  {
    title: 'Products Report',
    path: 'reports/products',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: ProductsReportComponent,
  },
  {
    title: 'Lojas',
    path: 'shops',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: ShopsComponent,
  },
  {
    title: 'Addresses',
    path: 'addresses',
    component: AddressesComponent,
    children: [
      {
        title: 'Addresses',
        path: '',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager] },
        component: AddressesTreeComponent,
      },
      {
        title: 'Address',
        path: ':id',
        canActivate: [AuthRoleGuard],
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager] },
        component: AddressComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
