import {Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef} from '@angular/core';
import {ILogChatAPI, ILogChatTemplate} from '../../../@core/models/log-chat.models';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { LogChatService } from '../../../@core/services/log-chat.service';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import {NbDialogRef, NbDialogService} from '@nebular/theme';

@Component({
  selector: 'ngx-log-chat-api-list',
  templateUrl: './log-chat-api-list.component.html',
  styleUrls: ['./log-chat-api-list.component.scss'],
})
export class LogChatApiListComponent implements OnInit {
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() transId: string;
  @Output() transIdSelected = new EventEmitter();
  dialogFullContentRef: NbDialogRef<any>;
  @ViewChild('fullContent') dialogTemplate: TemplateRef<any>;
  logAPIs: ILogChatAPI[] = [];
  content = '';
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;
  allowedPageSizes = [10, 20, 50];
  @ViewChild('pagin', { static: false }) pagin: NgbPagination;

  constructor(private logChatService: LogChatService,
              private dialogService: NbDialogService) {}

  ngOnInit(): void {}

  showFullContent(content: string) {
    this.content = content;
    this.dialogFullContentRef = this.dialogService.open(this.dialogTemplate);
  }

  daysAgo(days: number, startOrEndOfDay: 'start' | 'end'): Date {
    const d = new Date();
    d.setDate(d.getDate() - days);
    if (startOrEndOfDay === 'start') {
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
    } else {
      d.setHours(23);
      d.setMinutes(59);
      d.setSeconds(59);
      d.setMilliseconds(999);
    }
    return d;
  }

  load(transId?: string) {
    this.transId = transId ? transId : this.transId;
    const fromDate = new Date(this.fromDate);
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);
    const toDate = new Date(this.toDate);
    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    toDate.setMilliseconds(999);
    this.logChatService
      .searchLogAPIs({
        page: this.page - 1,
        size: this.pageSize,
        transId: this.transId,
        fromDate,
        toDate,
      })
      .subscribe((res) => {
        this.logAPIs = res.items;
        this.total = res.total;
      });
  }

  search() {
    this.page = 1;
    this.load();
  }

  get startIndex() {
    const start = (this.page - 1) * this.pageSize + 1;
    return start > this.total ? this.total : start;
  }

  get endIndex() {
    const end = this.startIndex + this.pageSize - 1;
    return end > this.total ? this.total : end;
  }

  handlePageChange(page: number) {
    this.page = page;
    this.load();
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.load();
  }
}
