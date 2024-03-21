import { Component, OnInit, ViewChild } from '@angular/core';
import { IActionLog } from '../../../@core/models/log.models';
import { LogApiService } from '../../../@core/services/log-api.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import { FormControl, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'ngx-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss'],
})
export class LogListComponent implements OnInit {
  actionLogs: IActionLog[] = [];

  page: number = 0;
  pageSize: number = 10;
  total: number = 0;
  allowedPageSizes = [10, 20, 50];
  @ViewChild('pagin', { static: false }) pagin: NgbPagination;
  fromDateCtrl = new FormControl();
  toDateCtrl = new FormControl();
  username: string;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private logApiService: LogApiService,
    private simpleMessage: SimpleMessageService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fromDateCtrl.reset();
      this.toDateCtrl.reset();
      const { page, size, fromDate, toDate, username } = params;
      const fromDateValue = !isNaN(new Date(fromDate).getTime()) ? new Date(fromDate) : this.daysAgo(7, 'start');
      const toDateValue = !isNaN(new Date(toDate).getTime()) ? new Date(toDate) : this.daysAgo(0, 'end');
      this.fromDateCtrl.setValue(fromDateValue);
      this.toDateCtrl.setValue(toDateValue);
      this.username = username;

      this.page = +page || 1;
      this.pageSize = +size || this.allowedPageSizes[0];
      if (!this.allowedPageSizes.includes(this.pageSize)) {
        this.pageSize = this.allowedPageSizes[0];
        this.updateQueryParams();
      }
      setTimeout(() => this.fetch());
    });

    this.fromDateCtrl.setValidators(Validators.required);
    this.toDateCtrl.setValidators(Validators.required);

    this.fromDateCtrl.valueChanges.subscribe((value: Date) => {
      const toDateValue = this.toDateCtrl.value as Date;
      if (value && toDateValue && !isNaN(new Date(value).getTime()) && !isNaN(new Date(toDateValue).getTime())) {
        if (value.getTime() > toDateValue.getTime()) {
          this.fromDateCtrl.setErrors({ maxValue: true });
        } else {
          this.toDateCtrl.setErrors({ minValue: null });
          this.fromDateCtrl.setErrors({ maxValue: null });
        }
      }
    });
    this.toDateCtrl.valueChanges.subscribe((value: Date) => {
      const fromDateValue = this.fromDateCtrl.value as Date;
      if (value && fromDateValue && !isNaN(new Date(value).getTime()) && !isNaN(new Date(fromDateValue).getTime())) {
        if (value.getTime() < fromDateValue.getTime()) {
          this.toDateCtrl.setErrors({ minValue: true });
        } else {
          this.toDateCtrl.setErrors({ minValue: null });
          this.fromDateCtrl.setErrors({ maxValue: null });
        }
      }
    });
  }

  get formInvalid() {
    // Problem: date-fns or @nebular-fns cannot parse format dd/MM/yyyy properly
    // and still sets an error 'nbDatepickerParse' into the form control.
    // Related to this issue: https://github.com/akveo/nebular/issues/1056

    // This is expected to be the right code
    // return this.fromDateCtrl.invalid || this.toDateCtrl.invalid;

    // This code is a hack as a temporary solution
    const hasError =
      (this.fromDateCtrl.errors && (this.fromDateCtrl.errors.required || this.fromDateCtrl.errors.maxValue)) ||
      (this.toDateCtrl.errors && (this.toDateCtrl.errors.required || this.toDateCtrl.errors.minValue));
    return hasError;
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

  fetch() {
    this.logApiService
      .search({
        page: this.page - 1,
        size: this.pageSize,
        fromDate: this.fromDateCtrl.value,
        toDate: this.toDateCtrl.value,
        username: this.username,
      })
      .subscribe((res) => {
        this.actionLogs = res.items;
        this.total = res.total;
      }, err => {
        this.actionLogs = [];
        this.total = 0;
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
      fileSaver.saveAs(url, 'action-log.xlsx');
    };
    const error = (err) => {
      this.simpleMessage.error(err);
    };
    const fromDate = new Date(this.fromDateCtrl.value);
    const toDate = new Date(this.toDateCtrl.value);
    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    toDate.setMilliseconds(999);
    this.logApiService
      .export({ fromDate: fromDate, toDate: toDate, username: this.username })
      .subscribe(next, error);
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
    const fromDate = new Date(this.fromDateCtrl.value);
    const toDate = new Date(this.toDateCtrl.value);
    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    toDate.setMilliseconds(999);
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        size: this.pageSize,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        username: this.username,
      },
      queryParamsHandling: 'merge',
    });
  }
}
