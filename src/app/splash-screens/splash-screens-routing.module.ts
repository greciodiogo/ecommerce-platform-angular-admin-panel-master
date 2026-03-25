import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoleGuard } from '../core/auth/guards/auth-role.guard';
import { User } from '../core/api';
import RoleEnum = User.RoleEnum;
import { SplashScreensComponent } from './splash-screens/splash-screens.component';
import { SplashScreensListComponent } from './splash-screens-list/splash-screens-list.component';
import { SplashScreenFormComponent } from './splash-screen-form/splash-screen-form.component';

const routes: Routes = [
  {
    title: 'Splash Screens',
    path: '',
    canActivate: [AuthRoleGuard],
    data: { roles: [RoleEnum.Admin] },
    component: SplashScreensComponent,
    children: [
      {
        title: 'Novo Splash Screen',
        path: 'new',
        component: SplashScreenFormComponent,
      },
      {
        title: 'Editar Splash Screen',
        path: ':id',
        component: SplashScreenFormComponent,
      },
      {
        title: 'Splash Screens',
        path: '',
        component: SplashScreensListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplashScreensRoutingModule {}
