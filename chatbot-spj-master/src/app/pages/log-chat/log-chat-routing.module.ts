import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogChatComponent } from './log-chat.component';
import { LiveChatComponent } from './live-chat/live-chat.component';
import { LogChatListComponent } from './log-chat-list/log-chat-list.component';
import {AuthGuard} from '../../@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LogChatComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Log Chat',
      title: 'Log Chat',
      pageTitle: 'Log Chat',
    },
    children: [
      {
        path: 'live',
        component: LiveChatComponent,
        data: {
          breadcrumb: 'Live Chat',
          title: 'Live Chat',
          pageTitle: 'Live Chat',
        },
      },
      {
        path: '',
        component: LogChatListComponent,
        pathMatch: 'full',
        data: {
          breadcrumb: 'Log Chat Management',
          title: 'Log Chat Management',
          pageTitle: 'Log Chat Management',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogChatRoutingModule {}
