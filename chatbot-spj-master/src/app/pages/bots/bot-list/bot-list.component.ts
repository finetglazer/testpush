import { Component, OnInit, ViewChild } from '@angular/core';
import { BotApiService } from '../../../@core/services/bot-api.service';
import { IBot } from '../../../@core/models/bot.models';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleMessageService } from '../../../shared/simple-message.service';

@Component({
  selector: 'ngx-bot-list',
  templateUrl: './bot-list.component.html',
  styleUrls: ['./bot-list.component.scss'],
})
export class BotListComponent implements OnInit {
  bots: IBot[] = [];

  page: number = 0;
  pageSize: number = 8;
  total: number = 0;
  allowedPageSizes = [8, 12, 24];
  @ViewChild('pagin', { static: false }) pagin: NgbPagination;
  filter: any = {
    itemName: undefined,
    itemCode: undefined,
    categoryId: undefined,
    status: undefined,
    categoryParentId: undefined,
    parentId: undefined,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private botApiService: BotApiService,
    private simpleMessage: SimpleMessageService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { page, size, botName } = params;
      this.filter = {
        botName: botName || undefined,
      };
      this.page = +page || 1;
      this.pageSize = +size || this.allowedPageSizes[0];
      if (!this.allowedPageSizes.includes(this.pageSize)) {
        this.pageSize = this.allowedPageSizes[0];
        this.updateQueryParams();
      }
      setTimeout(() => this.fetch());
    });
  }

  fetch() {
    this.botApiService
      .search({
        page: this.page - 1,
        size: this.pageSize,
        ...this.filter,
      })
      .subscribe((res) => {
        this.bots = res.items;
        this.total = res.total;
      });
  }

  search() {
    this.page = 1;
    this.updateQueryParams();
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
    this.updateQueryParams();
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.updateQueryParams();
  }

  updateQueryParams() {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        size: this.pageSize,
        ...this.filter,
      },
      queryParamsHandling: 'merge',
    });
  }
}
