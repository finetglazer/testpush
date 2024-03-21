/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { SimpleMessageService } from './shared/simple-message.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from './@core/services/cookie.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { APP_DEFAULT_LANGUAGE } from './@core/constants';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  languages = ['en', 'vi', 'km'];

  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private simpleMessage: SimpleMessageService,
    private vcr: ViewContainerRef,
    private translateService: TranslateService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router,
    private tiltleService: Title,
  ) {}

  ngOnInit(): void {
    this.simpleMessage.setRootContainerRef(this.vcr);
    const lang = this.cookieService.getCookie(this.cookieService.KEYS.LANG);
    if (this.languages.includes(lang)) {
      this.translateService.use(lang);
    } else {
      this.translateService.use(APP_DEFAULT_LANGUAGE);
    }
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let lastRoute = this.route;
      while (lastRoute.firstChild) {
        lastRoute = lastRoute.firstChild;
      }
      // tslint:disable-next-line: no-string-literal
      const title = lastRoute.snapshot.data['title'] || lastRoute.snapshot.data['pageTitle'];
      if (title) {
        this.tiltleService.setTitle(title + ' - ' + 'ChatBot');
      } else {
        this.tiltleService.setTitle('ChatBot');
      }
    });
    // this.analytics.trackPageViews();
    // this.seoService.trackCanonicalChanges();
  }
}
