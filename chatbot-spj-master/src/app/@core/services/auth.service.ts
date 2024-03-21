import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { CookieService } from './cookie.service';
import { User } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import * as jwtDecode from 'jwt-decode';
import {MENU_CODE_ROUTER} from '../constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  /**
   * Returns the current user
   */
  public currentUser(): User {
    if (!this.user) {
      this.user = JSON.parse(this.cookieService.getCookie(this.cookieService.KEYS.CURRENT_USER));
    }
    return this.user;
  }

  /**
   * Performs the auth
   * @param username username of user
   * @param password password of user
   * @param rememberMe remember credentials or not
   */
  login(username: string, password: string, rememberMe: boolean = false) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/api/authenticate`, { username, password, rememberMe })
      .pipe(
        map(({ id_token }) => {
          // login successful if there's a jwt token in the response
          if (id_token) {
            // store user details and jwt in cookie
            const decoded = jwtDecode(id_token);
            const roleMenus = (decoded.auth && decoded.auth.split(',')) || [];
            this.user = {
              sub: decoded.sub,
              roles: roleMenus.map(role => MENU_CODE_ROUTER[role]),
              token: id_token,
            };
            this.cookieService.setCookie(this.cookieService.KEYS.CURRENT_USER, JSON.stringify(this.user), 100);
            const currentLang = this.cookieService.getCookie(this.cookieService.KEYS.LANG);
            if (!currentLang) {
              this.cookieService.setCookie(this.cookieService.KEYS.LANG, 'en', 100);
            }
          }
          return id_token;
        }),
      );
  }

  isAdmin() {
    return this.user.roles.includes('CMS_DMS_ADMIN');
  }

  /**
   * Logout the user
   */
  logout() {
    // remove user from local storage to log user out
    this.cookieService.deleteCookie(this.cookieService.KEYS.CURRENT_USER);
    this.user = null;
  }
}
