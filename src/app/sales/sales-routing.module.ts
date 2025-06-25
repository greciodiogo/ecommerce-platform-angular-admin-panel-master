import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './pages/orders/orders.component';
import { ReturnsComponent } from './pages/returns/returns.component';
import { PaymentMethodsComponent } from './pages/payment-methods/payment-methods.component';
import { DeliveryMethodsComponent } from './pages/delivery-methods/delivery-methods.component';
import { AuthRoleGuard } from '../core/auth/guards/auth-role.guard';
import { User } from '../core/api';
import RoleEnum = User.RoleEnum;
import { CreateReturnFormComponent } from './pages/create-return-form/create-return-form.component';
import { ReturnsListComponent } from './pages/returns-list/returns-list.component';
import { CreateOrderFormComponent } from './pages/create-order-form/create-order-form.component';
import { OrderComponent } from './pages/order/order.component';
import { OrdersListComponent } from './pages/orders-list/orders-list.component';
import { ReturnComponent } from './pages/return/return.component';
import { SalesListComponent } from './pages/sales-list/sales-list.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ComplaintComponent } from './pages/complaint/complaint.component';
import { ComplaintsListComponent } from './pages/complaints-list/complaints-list.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { CreateComplaintFormComponent } from './pages/create-complaint-form/create-complaint-form.component';
import { ShopkeeperSalesComponent } from './pages/shopkeepersales/shopkeepersales.component';
import { ShopkeeperSalesListComponent } from './pages/shopkeepersales-list/shopkeepersales-list.component';
import { CreateShopkeeperSaleFormComponent } from './pages/create-shopkeepersale-form/create-shopkeepersale-form.component';
import { ShopkeeperSaleComponent } from './pages/shopkeepersale/shopkeepersale.component';
import { SalesReportComponent } from './pages/sales-report/sales-report.component';
import { OrdersReportComponent } from './pages/orders-report/orders-report.component';

const routes: Routes = [
  {
    title: 'Shopkeeper Sales',
    path: 'shopkeepersales',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
    component: ShopkeeperSalesComponent,
    children: [
      {
        title: 'Create new Shopkeeper Sale',
        path: 'new',
        component: CreateShopkeeperSaleFormComponent,
      },
      {
        title: 'Shopkeeper Sale',
        path: ':id',
        component: ShopkeeperSaleComponent,
      },
      {
        title: 'Shopkeeper Sales',
        path: '',
        component: ShopkeeperSalesListComponent,
      },
    ],
  },
  {
    title: 'Orders',
    path: 'orders',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
    component: OrdersComponent,
    children: [
      {
        title: 'Create new order',
        path: 'new',
        component: CreateOrderFormComponent,
      },
      {
        title: 'Order',
        path: ':id',
        component: OrderComponent,
      },
      {
        title: 'Orders',
        path: '',
        component: OrdersListComponent,
      },
    ],
  },
  {
    title: 'Complaints',
    path: 'complaints',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
    component: ComplaintsComponent,
    children: [
      {
        title: 'Create new complaint',
        path: 'new',
        component: CreateComplaintFormComponent,
      },
      {
        title: 'Complaints',
        path: ':id',
        component: ComplaintComponent,
      },
      {
        title: 'Complaints',
        path: '',
        component: ComplaintsListComponent,
      },
    ],
  },
  {
    title: 'Sales',
    path: 'sales',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
    component: SalesComponent,
    children: [
      {
        title: 'Sales',
        path: ':id',
        component: SalesListComponent,
      },
      {
        title: 'Sales',
        path: '',
        component: SalesListComponent,
      },
    ],
  },
  {
    title: 'Returns',
    path: 'returns',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Sales] },
    component: ReturnsComponent,
    children: [
      {
        title: 'Create new return',
        path: 'new',
        component: CreateReturnFormComponent,
      },
      {
        title: 'Return',
        path: ':id',
        component: ReturnComponent,
      },
      {
        title: 'Returns',
        path: '',
        component: ReturnsListComponent,
      },
    ],
  },
  {
    title: 'Payment methods',
    path: 'payment-methods',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: PaymentMethodsComponent,
  },
  {
    title: 'Delivery methods',
    path: 'delivery-methods',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: DeliveryMethodsComponent,
  },
  {
    title: 'Sales Report',
    path: 'sales-report',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Sales] },
    component: SalesReportComponent,
  },
  {
    title: 'Orders Report',
    path: 'orders-report',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Sales] },
    component: OrdersReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
