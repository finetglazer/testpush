import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { ILogChat, ILogChatTemplate, ILogChatAPI } from '../models/log-chat.models';

export interface IUserChat {
  id: number;
  userName: string;
  lastChatDate: Date;
  lastContent: string;
  isRead: number;
  botCode: string;
  userId: string;
  color: string;
}

export interface IMessage {
  id: number;
  content: string;
  userName: string;
  userId: string;
  token: string;
  isQuestion: number;
  msisdn: string;
  createdDate: Date;
  category: string;
  referenceId: string;
  device: string;
  actionType: string;
  botCode: string;
}

export interface ILogChatSearchParams {
  botCode: string;
  fromDate: Date;
  toDate: Date;
  userName?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root',
})
export class LogChatService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiBaseUrl}/api/chat-`;
  }

  loadHistory(filter: any) {
    return this.http
      .post(
        this.baseUrl + 'histories-search',
        {
          botCode: filter.botCode,
          userName: filter.userName,
        },
        {
          /*        params: {
                  page: data.page.toString(),
                  size: data.size.toString(),
                },*/
          observe: 'response',
          headers: {
            'PopUp-On-Error': 'true',
          },
        },
      )
      .pipe(
        map((resp: HttpResponse<Object>) => {
          const items = resp.body as IMessage[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }

  searchUser(filter: any) {
    return this.http
      .post(
        this.baseUrl + 'users-search',
        {},
        {
          /*        params: {
          page: data.page.toString(),
          size: data.size.toString(),
        },*/
          observe: 'response',
          headers: {
            'PopUp-On-Error': 'true',
          },
        },
      )
      .pipe(
        map((resp: HttpResponse<Object>) => {
          const items = resp.body as IUserChat[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }

  searchLog(data: { fromDate: any; size: number; toDate: any; botCode: string; page: number; userName: string }) {
    return this.http
      .post(this.baseUrl + 'histories-searchLog', data, {
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
          const items = resp.body as ILogChat[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }

  exportLog(filter: { fromDate: Date; toDate: Date; userName?: string; botCode: string }) {
    return this.http.post(this.baseUrl + 'histories-exportLog', filter, { responseType: 'blob' });
  }

  searchLogTemplates(data: {
    page: number;
    size: number;
    fromDate: Date;
    toDate: Date;
    userId: string;
    username: string;
  }) {
    return this.http
      .post(`${environment.apiBaseUrl}/api/log-templates-search`, data, {
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
          const items = resp.body as ILogChatTemplate[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }

  searchLogAPIs(data: {
    page: number;
    size: number;
    fromDate: Date;
    toDate: Date;
    transId: string;
  }) {
    return this.http
      .post(`${environment.apiBaseUrl}/api/log-apis-search`, data, {
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
          const items = resp.body as ILogChatAPI[];
          const total = +resp.headers.get('X-Total-Count');
          return { items, total };
        }),
      );
  }
}
