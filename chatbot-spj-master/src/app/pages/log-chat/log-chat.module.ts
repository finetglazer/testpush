import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogChatComponent } from './log-chat.component';
import { LogChatRoutingModule } from './log-chat-routing.module';
import {
  NbCardModule,
  NbChatModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbUserModule,
  NbDatepickerModule,
  NbSelectModule,
  NbButtonModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LogChatListComponent } from './log-chat-list/log-chat-list.component';
import { LiveChatComponent } from './live-chat/live-chat.component';
import { LogChatDetailComponent } from './log-chat-detail/log-chat-detail.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { LogChatTemplateListComponent } from './log-chat-template-list/log-chat-template-list.component';
import { LogChatApiListComponent } from './log-chat-api-list/log-chat-api-list.component';

@NgModule({
  declarations: [LogChatComponent, LogChatListComponent, LiveChatComponent, LogChatDetailComponent, LogChatTemplateListComponent, LogChatApiListComponent],
  imports: [
    CommonModule,
    LogChatRoutingModule,
    NbCardModule,
    NbIconModule,
    NbFormFieldModule,
    TranslateModule,
    NbInputModule,
    FormsModule,
    NbListModule,
    NbUserModule,
    SharedModule,
    NbChatModule,
    NbDatepickerModule,
    NgbPaginationModule,
    NbSelectModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NbDateFnsDateModule,
  ],
})
export class LogChatModule {}
