import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplatesComponent } from './templates.component';
import { TemplateListComponent } from './template-list/template-list.component';
import {AuthGuard} from '../../@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: TemplateListComponent,
        data: {
          breadcrumb: 'Template management',
          title: 'Template management',
          pageTitle: 'Template management',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
