import { Injectable } from '@angular/core';
import { CookieService } from '../@core/services/cookie.service';
import { APP_DEFAULT_THEME } from '../@core/constants';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  constructor(private cookieService: CookieService) {}

  saveThemeConfig(theme = APP_DEFAULT_THEME) {
    this.cookieService.setCookie(this.cookieService.KEYS.THEME, theme, 0);
  }

  loadThemeConfig(): string {
    return this.cookieService.getCookie(this.cookieService.KEYS.THEME);
  }

  changeBot(botCode: string) {
    this.cookieService.setCookie(this.cookieService.KEYS.BOT, botCode, 0);
  }

  loadBotCode(): string {
    return this.cookieService.getCookie(this.cookieService.KEYS.BOT);
  }
}
