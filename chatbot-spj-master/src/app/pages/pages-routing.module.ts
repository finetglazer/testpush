import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { DefaultDashboardComponent } from './dashboard/default-dashboard/default-dashboard.component';
import { AuthGuard } from '../@core/guards/auth.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: 'dashboard',
      component: DefaultDashboardComponent,
      data: {
        breadcrumb: 'Dashboard',
        title: 'Dashboard',
        pageTitle: 'Dashboard',
      },
    },
    {
      path: 'services',
      loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
    },
    {
      path: 'templates',
      loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule),
    },
    {
      path: 'logs',
      loadChildren: () => import('./logs/logs.module').then(m => m.LogsModule),
    },
    {
      path: 'categories',
      loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule),
    },
    {
      path: 'bots',
      loadChildren: () => import('./bots/bots.module').then(m => m.BotsModule),
    },
    {
      path: 'log-chats',
      loadChildren: () => import('./log-chat/log-chat.module').then(m => m.LogChatModule),
    },
    {
      path: '',
      redirectTo: 'bots',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
