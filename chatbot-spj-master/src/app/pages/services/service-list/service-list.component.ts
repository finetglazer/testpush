import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceApiService } from '../../../@core/services/service-api.service';
import { IService } from '../../../@core/models/service.model';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import {AppConfigService} from '../../../shared/app-config.service';

@Component({
  selector: 'ngx-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit {
  services: IService[] = [];

  page: number = 0;
  pageSize: number = 10;
  total: number = 0;
  allowedPageSizes = [10, 20, 50];
  @ViewChild('pagin', { static: false }) pagin: NgbPagination;
  filter: any = {
    serviceCode: undefined,
    status: undefined,
    method: undefined,
    type: undefined,
    project: undefined,
  };

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private serviceApiService: ServiceApiService,
    private simpleMessage: SimpleMessageService,
    private appConfig: AppConfigService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { page, size, serviceCode, url, type, method, status, project } = params;
      this.filter = {
        serviceCode,
        url,
        type,
        method,
        status: !isNaN(+status) ? +status : undefined,
        project,
        botCode: this.appConfig.loadBotCode(),
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
    this.serviceApiService
      .search({
        page: this.page - 1,
        size: this.pageSize,
        ...this.filter,
      })
      .subscribe((res) => {
        this.services = res.items;
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

  deleteService(service: IService) {
    const onSuccess = () => {
      this.simpleMessage.success(this.translateService.instant('Record successfully deleted'));
      this.fetch();
    };
    const onError = (err) => {
      this.simpleMessage.success(err);
    };
    this.serviceApiService.delete(service && service.id).subscribe(onSuccess, onError);
  }
}
