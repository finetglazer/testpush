import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateEditComponent } from './template-edit/template-edit.component';
import { SharedModule } from '../../shared/shared.module';
import { ThemeModule } from '../../@theme/theme.module';
import {
  NbInputModule,
  NbCardModule,
  NbButtonModule,
  NbActionsModule,
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
import { TemplateClazzSelectComponent } from './template-clazz-select/template-clazz-select.component';
import { TemplateServiceSelectComponent } from './template-service-select/template-service-select.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ServicesModule } from '../services/services.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    TemplatesComponent,
    TemplateListComponent,
    TemplateEditComponent,
    TemplateClazzSelectComponent,
    TemplateServiceSelectComponent,
  ],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    SharedModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
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
    Ng2SmartTableModule,
    NgSelectModule,
    ServicesModule,
  ],
})
export class TemplatesModule {}
