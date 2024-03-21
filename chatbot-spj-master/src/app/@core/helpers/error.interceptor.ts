import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { SimpleMessageService } from '../../shared/simple-message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private simpleMessage: SimpleMessageService;

  constructor(private injector: Injector, private authenticationService: AuthenticationService) {
    setTimeout(() => {
      this.simpleMessage = this.injector.get(SimpleMessageService);
    }, 1000);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        // Ensure all deps are resovled
        if (!this.simpleMessage) {
          this.simpleMessage = this.injector.get(SimpleMessageService);
        }

        if (err.status === 401 && !String(err.url).endsWith('/api/authenticate')) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          location.reload();
        }
        const error = err.error && (err.error.detail || err.error.title || err.error.message || err.statusText);

        const popupOnError = request.headers.get('PopUp-On-Error');
        if (popupOnError === 'true') {
          this.simpleMessage.error(error);
        }

        return throwError(error);
      })
    );
  }
}
