import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { ITemplate, ITemplateDetail } from '../models/template.model';

export interface ITemplateSearchParams {
  templateCode?: string;
  status?: number;
  page?: number;
  size?: number;
  botCode: string;
}

@Injectable({ providedIn: 'root' })
export class TemplateApiService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiBaseUrl}/api/templates`;
  }

  search(data: ITemplateSearchParams) {
    return this.http
      .post(this.baseUrl + '-search', data, {
        params: {
          page: data.page.toString(),
          size: data.size.toString(),
        },
        observe: 'response',
      })
      .pipe(
        map((resp: HttpResponse<Object>) => {
          const items = resp.body as ITemplate[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }

  getById(templateId: number) {
    return this.http.get<ITemplateDetail>(this.baseUrl + `/${templateId}`);
  }

  create(data: any = {}) {
    return this.http.post(this.baseUrl, data);
  }

  update(data: any = {}) {
    return this.http.put(this.baseUrl, data);
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + `/${id}`);
  }
}