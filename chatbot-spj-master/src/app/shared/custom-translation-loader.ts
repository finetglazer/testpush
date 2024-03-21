import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

export class CustomTranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient, private prefix: string = '/assets/i18n/', private suffix: string = '.json') {}

  public getTranslation(lang: string): any {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`).map((res: any) => this.process(res));
  }

  private process(object: any) {
    const newObject = {};

    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof object[key] === 'object' && object[key] != null) {
          newObject[key] = this.process(object[key]);
        } else if (typeof object[key] === 'string' && object[key] === '') {
          // do not copy empty strings
        } else {
          newObject[key] = object[key];
        }
      }
    }

    return newObject;
  }
}
