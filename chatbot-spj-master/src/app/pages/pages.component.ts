import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import {NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {AppConfigService} from '../shared/app-config.service';
import {AuthenticationService} from '../@core/services/auth.service';
import {NbMenuItem} from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu = [];

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private appConfig: AppConfigService) {

    const currentUser = authenticationService.currentUser();
    this.menu = MENU_ITEMS.filter(menu => currentUser.roles.includes(menu.link));

    // need a bot before doing anything
    router.events
      .pipe(
        filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
          if (!event.url.startsWith('/auth/login')
            && (!this.appConfig.loadBotCode() && !event.url.startsWith('/pages/bots'))) {
            this.router.navigate(['/pages/bots']);
          }
        },
    );

    if (!location.pathname.startsWith('/auth/login')
      && (!this.appConfig.loadBotCode() && !location.pathname.startsWith('/pages/bots'))) {
      this.router.navigate(['/pages/bots']);
    }

  }
}
