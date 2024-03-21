import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryStatusSelectComponent } from './category-status-select/category-status-select.component';
import { CategorySelectComponent } from './category-select/category-select.component';
import { SharedModule } from '../../shared/shared.module';
import { ThemeModule } from '../../@theme/theme.module';
import {
  NbInputModule,
  NbCardModule,
  NbButtonModule,
  NbActionsModule,
  NbUserModule,
  NbCheckboxModule,
  NbRadioModule,
  NbDatepickerModule,
  NbSelectModule,
  NbIconModule,
  NbToggleModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { CategoryItemSelectComponent } from './category-item-select/category-item-select.component';

@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryListComponent,
    CategoryEditComponent,
    CategoryStatusSelectComponent,
    CategorySelectComponent,
    CategoryItemSelectComponent,
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbIconModule,
    NbToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    TranslateModule,
    NgSelectModule,
    NbDateFnsDateModule,
  ],
})
export class CategoriesModule {}
