import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { IService, IServiceDetail } from '../models/service.model';

export interface IServiceSearchParams {
  serviceCode?: string;
  url?: string;
  method?: string;
  type?: string;
  status?: number;
  project?: string;
  page?: number;
  size?: number;
  botCode: string;
}

@Injectable({ providedIn: 'root' })
export class ServiceApiService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiBaseUrl}/api/services`;
  }

  search(data: IServiceSearchParams) {
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
          const items = resp.body as IService[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }

  getById(serviceId: number) {
    return this.http.get<IServiceDetail>(this.baseUrl + `/${serviceId}`);
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

  getAll() {
    return this.http.get<IService[]>(`${environment.apiBaseUrl}/api/services`);
  }
}
