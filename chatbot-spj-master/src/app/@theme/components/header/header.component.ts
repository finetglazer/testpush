import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import {filter, map, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '../../../@core/models/auth.models';
import { AuthenticationService } from '../../../@core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from '../../../@core/services/cookie.service';
import { AppConfigService } from '../../../shared/app-config.service';
import { APP_DEFAULT_THEME } from '../../../@core/constants';
import * as randomColor from 'randomcolor';
import {IBot} from '../../../@core/models/bot.models';
import {BotApiService} from '../../../@core/services/bot-api.service';
import {ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: User;
  currentLang: string;
  bots: IBot[] = [];
  color: string;
  showListBot = true;
  themes = [
    {
      value: 'default',
      name: 'Theme: Light',
    },
    {
      value: 'dark',
      name: 'Theme: Dark',
    }];

  currentTheme = 'dark';
  currentBot = '';
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private authService: AuthenticationService,
    private layoutService: LayoutService,
    private botApiService: BotApiService,
    private breakpointService: NbMediaBreakpointsService,
    private translateService: TranslateService,
    private cookieService: CookieService,
    private router: Router,
    private appConfig: AppConfigService,
  ) {}

  ngOnInit() {
    if (!this.themes.find(th => th.value === this.currentTheme)) {
      this.currentTheme = APP_DEFAULT_THEME;
    }
    this.color = randomColor({ luminosity: 'light' });
    this.currentTheme = this.appConfig.loadThemeConfig() || APP_DEFAULT_THEME;
    this.currentBot = this.appConfig.loadBotCode() || '';
    this.changeTheme(this.currentTheme);
    this.currentLang = this.cookieService.getCookie(this.cookieService.KEYS.LANG);

    this.user = this.authService.currentUser();

    this.botApiService
      .search({page: 0, size: 1000})
      .subscribe((res) => {
        this.bots = res.items;
      });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl),
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe((themeName) => (this.currentTheme = themeName));

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe((event: NavigationEnd) => {
      if (event.url.startsWith('/pages/bots')) {
        this.showListBot = false;
      } else {
        this.showListBot = true;
      }
    });

    if (this.router.url.startsWith('/pages/bots')) {
      this.showListBot = false;
    }

  }

  hasBot() {
    return this.appConfig.loadBotCode() != null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
    this.appConfig.saveThemeConfig(themeName);
  }

  changeBot(botCode: string) {
    this.appConfig.changeBot(botCode);
    location.reload();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  navigateBot() {
    this.router.navigate(['/pages/bots']);
    return false;
  }

  changeLanguage(lang: 'en' | 'vi' | 'km') {
    this.currentLang = lang;
    this.translateService.use(lang);
    this.cookieService.setCookie(this.cookieService.KEYS.LANG, lang, 0);
  }
}
