import { Component, OnInit, ViewChild } from '@angular/core';
import { ICategoryItem } from '../../../@core/models/category.model';
import { CategoryApiService } from '../../../@core/services/category-api.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'ngx-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  categories: ICategoryItem[] = [];

  page: number = 0;
  pageSize: number = 10;
  total: number = 0;
  allowedPageSizes = [10, 20, 50];
  @ViewChild('pagin', { static: false }) pagin: NgbPagination;
  filter: any = {
    itemName: undefined,
    itemCode: undefined,
    categoryId: undefined,
    status: undefined,
    categoryParentId: undefined,
    parentId: undefined,
  };
  loadCount = 0;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private categoryApiService: CategoryApiService,
    private simpleMessage: SimpleMessageService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { page, size, itemName, itemCode, categoryId, categoryParentId, parentId, status } = params;
      this.filter = {
        itemName,
        itemCode,
        categoryId: !isNaN(+categoryId) ? +categoryId : undefined,
        categoryParentId: !isNaN(+categoryParentId) ? +categoryParentId : undefined,
        parentId: !isNaN(+parentId) ? +parentId : undefined,
        status: !isNaN(+status) ? +status : undefined,
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
    this.categoryApiService
      .search({
        page: this.page - 1,
        size: this.pageSize,
        ...this.filter,
      })
      .subscribe((res) => {
        this.categories = res.items;
        this.total = res.total;
      });
  }

  search() {
    this.page = 1;
    this.updateQueryParams();
  }

  export() {
    const next = (data: Blob) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(url, 'category-items.xlsx');
    };
    const error = (err) => {
      this.simpleMessage.error(err);
    };
    this.categoryApiService.export({ ...this.filter }).subscribe(next, error);
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

  deleteTemplate(cat: ICategoryItem) {
    const onSuccess = () => {
      this.simpleMessage.success(this.translateService.instant('Record successfully deleted'));
      this.fetch();
    };
    const onError = (err) => {
      this.simpleMessage.success(err);
    };
    this.categoryApiService.delete(cat && cat.id).subscribe(onSuccess, onError);
  }
}
