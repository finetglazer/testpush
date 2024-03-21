import { Component, OnInit, ViewChild } from '@angular/core';
import { ITemplate } from '../../../@core/models/template.model';
import { TemplateApiService } from '../../../@core/services/template-api.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import {AppConfigService} from '../../../shared/app-config.service';

@Component({
  selector: 'ngx-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
})
export class TemplateListComponent implements OnInit {
  templates: ITemplate[] = [];

  page: number = 0;
  pageSize: number = 10;
  total: number = 0;
  allowedPageSizes = [10, 20, 50];
  @ViewChild('pagin', { static: false }) pagin: NgbPagination;
  filter: any = {
    templateCode: undefined,
    status: undefined,
  };
  loadCount = 0;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private templateApiService: TemplateApiService,
    private simpleMessage: SimpleMessageService,
    private appConfig: AppConfigService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { page, size, templateCode, status } = params;
      this.filter = {
        templateCode,
        status: !isNaN(+status) ? +status : undefined,
        botCode: this.appConfig.loadBotCode(),
      };
      if (this.loadCount === 0 && this.filter.status === undefined) {
        this.filter.status = 1;
      }
      this.page = +page || 1;
      this.pageSize = +size || this.allowedPageSizes[0];
      if (!this.allowedPageSizes.includes(this.pageSize)) {
        this.pageSize = this.allowedPageSizes[0];
        this.updateQueryParams();
      }
      setTimeout(() => this.fetch());
      this.loadCount++;
    });
  }

  fetch() {
    this.templateApiService
      .search({
        page: this.page - 1,
        size: this.pageSize,
        ...this.filter,
      })
      .subscribe((res) => {
        this.templates = res.items;
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

  deleteTemplate(template: ITemplate) {
    const onSuccess = () => {
      this.simpleMessage.success(this.translateService.instant('Record successfully deleted'));
      this.fetch();
    };
    const onError = (err) => {
      this.simpleMessage.success(err);
    };
    this.templateApiService.delete(template && template.id).subscribe(onSuccess, onError);
  }
}
