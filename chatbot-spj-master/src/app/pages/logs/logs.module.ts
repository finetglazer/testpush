import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogsRoutingModule } from './logs-routing.module';
import { LogsComponent } from './logs.component';
import { LogListComponent } from './log-list/log-list.component';
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

@NgModule({
  declarations: [LogsComponent, LogListComponent],
  imports: [
    CommonModule,
    LogsRoutingModule,
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
export class LogsModule {}
