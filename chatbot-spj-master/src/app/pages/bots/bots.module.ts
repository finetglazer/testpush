import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotsRoutingModule } from './bots-routing.module';
import { BotsComponent } from './bots.component';
import { BotListComponent } from './bot-list/bot-list.component';
import { BotEditComponent } from './bot-edit/bot-edit.component';
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
  NbFormFieldModule,
  NbPopoverModule,
  NbPositionBuilderService,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { BotCardViewComponent } from './bot-card-view/bot-card-view.component';
import { PositionBuilderService } from '../../shared/nb-popover-position-builder';

@NgModule({
  declarations: [BotsComponent, BotListComponent, BotEditComponent, BotCardViewComponent],
  imports: [
    CommonModule,
    BotsRoutingModule,
    CommonModule,
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
    NbFormFieldModule,
    NbPopoverModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    TranslateModule,
    NgSelectModule,
    NbDateFnsDateModule,
  ],
  providers: [
    {
      provide: NbPositionBuilderService,
      useClass: PositionBuilderService,
    },
  ],
})
export class BotsModule {}
