import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoleGuard } from '../core/auth/guards/auth-role.guard';
import { User } from '../core/api';
import RoleEnum = User.RoleEnum;
import { BannersComponent } from './banners/banners.component';
import { BannersListComponent } from './banners-list/banners-list.component';
import { BannerFormComponent } from './banner-form/banner-form.component';

const routes: Routes = [
  {
    title: 'Banners',
    path: '',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: BannersComponent,
    children: [
      {
        title: 'Novo Banner',
        path: 'new',
        component: BannerFormComponent,
      },
      {
        title: 'Editar Banner',
        path: ':id',
        component: BannerFormComponent,
      },
      {
        title: 'Banners',
        path: '',
        component: BannersListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BannersRoutingModule {}
