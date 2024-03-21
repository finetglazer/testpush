import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { ICategoryItem, ICategory } from '../models/category.model';

export interface ICategorySearchParams {
  itemName?: string;
  itemCode?: string;
  categoryId?: number;
  status?: number;
  categoryParentId?: number;
  parentId?: number;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiBaseUrl}/api/cat-items`;
  }

  getMethods() {
    return this.http.get<ICategoryItem[]>(this.baseUrl + '/find-item-by-cat/2');
  }

  getServiceTypes() {
    return this.http.get<ICategoryItem[]>(this.baseUrl + '/find-item-by-cat/5');
  }

  getProjects() {
    return this.http.get<ICategoryItem[]>(this.baseUrl + '/find-item-by-cat/1');
  }

  getContentTypes() {
    return this.http.get<ICategoryItem[]>(this.baseUrl + '/find-item-by-cat/3');
  }

  getAuthTypes() {
    return this.http.get<ICategoryItem[]>(this.baseUrl + '/find-item-by-cat/6');
  }

  getLocations() {
    return this.http.get<ICategoryItem[]>(this.baseUrl + '/find-item-by-cat/4');
  }

  getClazzes() {
    return this.http.get<ICategoryItem[]>(this.baseUrl + '/find-item-by-cat/7');
  }

  findItemsByCategory(catId: number) {
    return this.http.get<ICategoryItem[]>(this.baseUrl + `/find-item-by-cat/${catId}`);
  }

  getCategories() {
    return this.http.get<ICategory[]>(`${environment.apiBaseUrl}/api/categories`);
  }

  search(data: ICategorySearchParams = {}) {
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
          const items = resp.body as ICategoryItem[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }

  getById(catId: number) {
    return this.http.get<ICategoryItem>(this.baseUrl + `/${catId}`);
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

  export(filter: Partial<ICategorySearchParams>) {
    return this.http.post(this.baseUrl + '-export', filter, { responseType: 'blob' });
  }
}
