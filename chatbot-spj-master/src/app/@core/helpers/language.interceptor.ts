import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CookieService } from '../services/cookie.service';
import { APP_DEFAULT_LANGUAGE } from '../constants';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lang = this.cookieService.getCookie(this.cookieService.KEYS.LANG) || APP_DEFAULT_LANGUAGE;
    request = request.clone({
      setHeaders: {
        'x-language': lang,
      },
    });
    return next.handle(request);
  }
}
