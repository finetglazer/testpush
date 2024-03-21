import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { IActionLog } from '../models/log.models';

export interface ILogSearchParams {
  fromDate: Date;
  toDate: Date;
  username?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class LogApiService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiBaseUrl}/api/action-logs`;
  }

  search(data: ILogSearchParams) {
    return this.http
      .post(this.baseUrl + '-search', data, {
        params: {
          page: data.page.toString(),
          size: data.size.toString(),
        },
        observe: 'response',
        headers: {
          'PopUp-On-Error': 'true',
        },
      })
      .pipe(
        map((resp: HttpResponse<Object>) => {
          const items = resp.body as IActionLog[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }

  export(filter: { fromDate: Date; toDate: Date; username?: string }) {
    return this.http.post(this.baseUrl + '-export', filter, { responseType: 'blob' });
  }
}
