import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoleGuard } from '../core/auth/guards/auth-role.guard';
import { SettingsComponent } from './pages/settings/settings.component';
import { DeliverySettingsPageComponent } from './pages/delivery-settings-page/delivery-settings-page.component';
import { DeliveryZonesPageComponent } from './pages/delivery-zones-page/delivery-zones-page.component';
import { SearchTagsPageComponent } from './pages/search-tags-page/search-tags-page.component';
import { User } from '../core/api';
import RoleEnum = User.RoleEnum;

const routes: Routes = [
  {
    title: 'Settings',
    path: '',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: SettingsComponent,
  },
  {
    title: 'Configurações de Entrega',
    path: 'delivery-settings',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: DeliverySettingsPageComponent,
  },
  {
    title: 'Zonas de Entrega',
    path: 'delivery-zones',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: DeliveryZonesPageComponent,
  },
  {
    title: 'Search Tags',
    path: 'search-tags',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: SearchTagsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
