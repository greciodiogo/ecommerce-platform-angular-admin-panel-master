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
        data: { roles: [RoleEnum.Admin, RoleEnum.Manager] },
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
    ],
  },
  {
    title: 'Relatórios',
    path: 'reports',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: ReportsComponent,
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
