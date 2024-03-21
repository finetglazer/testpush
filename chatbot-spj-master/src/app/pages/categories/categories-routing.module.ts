import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { CategoryListComponent } from './category-list/category-list.component';
import {AuthGuard} from '../../@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: CategoryListComponent,
        pathMatch: 'full',
        data: {
          breadcrumb: 'Category management',
          title: 'Category management',
          pageTitle: 'Category management',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
