import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IBot } from '../../../@core/models/bot.models';
import * as randomColor from 'randomcolor';
import { BotApiService } from '../../../@core/services/bot-api.service';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import { Router } from '@angular/router';
import { AppConfigService } from '../../../shared/app-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-bot-card-view',
  templateUrl: './bot-card-view.component.html',
  styleUrls: ['./bot-card-view.component.scss'],
})
export class BotCardViewComponent implements OnInit {
  @Input() bot: IBot;
  @Output() botDeleted = new EventEmitter();
  @Output() botUpdated = new EventEmitter();
  color: string;

  constructor(
    private botApiService: BotApiService,
    private router: Router,
    private appConfig: AppConfigService,
    private simpleMessage: SimpleMessageService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.bot.botName = this.bot.botName || 'N/A';
    this.color = randomColor({ luminosity: 'light' });
  }

  changeBot(botCode: string) {
    this.appConfig.changeBot(botCode);
    this.router.navigate(['/pages/templates']);
  }

  deleteBot(bot: IBot) {
    const onSuccess = () => {
      this.simpleMessage.success(this.translateService.instant('Record successfully deleted'));
      this.botDeleted.emit();
    };
    const onError = (err) => {
      this.simpleMessage.error(err);
    };
    this.botApiService.delete(bot && bot.id).subscribe(onSuccess, onError);
  }
}
