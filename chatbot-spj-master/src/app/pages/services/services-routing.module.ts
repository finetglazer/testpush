import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesComponent } from './services.component';
import { ServiceListComponent } from './service-list/service-list.component';
import {AuthGuard} from '../../@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ServiceListComponent,
        data: {
          breadcrumb: 'Service management',
          title: 'Service management',
          pageTitle: 'Service management',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesRoutingModule {}
