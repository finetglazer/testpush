import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './logs.component';
import { LogListComponent } from './log-list/log-list.component';
import {AuthGuard} from '../../@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LogsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: LogListComponent,
        data: {
          breadcrumb: 'Action Log Management',
          title: 'Action Log Management',
          pageTitle: 'Action Log Management',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogsRoutingModule {}
