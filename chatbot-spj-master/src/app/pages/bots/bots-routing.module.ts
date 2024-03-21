import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BotsComponent } from './bots.component';
import { BotListComponent } from './bot-list/bot-list.component';
import {AuthGuard} from '../../@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BotsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: BotListComponent,
        data: {
          breadcrumb: 'Bot management',
          title: 'Bot management',
          pageTitle: 'Bot management',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BotsRoutingModule {}
