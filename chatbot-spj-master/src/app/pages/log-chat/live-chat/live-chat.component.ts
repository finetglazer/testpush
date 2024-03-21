import { Component, OnInit } from '@angular/core';
import { LogChatService, IUserChat, IMessage } from '../../../@core/services/log-chat.service';
import * as randomColor from 'randomcolor';

@Component({
  selector: 'ngx-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss'],
})
export class LiveChatComponent implements OnInit {
  constructor(private logChatService: LogChatService) {}

  inputSearch = '';
  page: number = 0;
  pageSize: number = 8;
  total: number = 0;
  userChats: IUserChat[] = [];
  messages: IMessage[] = [];

  ngOnInit(): void {
    this.searchUserChat();
  }

  searchUserChat() {
    this.logChatService
      .searchUser({
        page: this.page - 1,
        size: this.pageSize,
      })
      .subscribe((res) => {
        this.userChats = res.items;
        this.userChats.forEach((userChat) => (userChat.color = randomColor({ luminosity: 'light' })));
        this.total = res.total;
        this.loadMessage(this.userChats[0].botCode, this.userChats[0].userName);
      });
  }

  loadMessage(botCode: string, userName: string) {
    this.logChatService
      .loadHistory({
        botCode: botCode,
        userName: userName,
      })
      .subscribe((res) => {
        this.messages = res.items;
        // this.userChats.forEach(userChat => userChat.color = randomColor({ luminosity: 'light' }));
        // this.total = res.total;
      });
  }
}
