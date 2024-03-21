import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { IBot } from '../models/bot.models';

export interface IBotSearchParams {
  botName?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class BotApiService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiBaseUrl}/api/bots`;
  }

  search(data: IBotSearchParams) {
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
          const items = resp.body as IBot[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + `/${id}`);
  }

  getById(id: number) {
    return this.http.get<IBot>(this.baseUrl + `/${id}`);
  }

  create(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  update(data: any) {
    return this.http.put(this.baseUrl, data);
  }
}
