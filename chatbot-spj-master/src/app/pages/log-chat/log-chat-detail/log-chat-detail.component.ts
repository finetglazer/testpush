import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { LogChatService } from '../../../@core/services/log-chat.service';
import { ILogChatTemplate } from '../../../@core/models/log-chat.models';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import { LogChatTemplateListComponent } from '../log-chat-template-list/log-chat-template-list.component';

@Component({
  selector: 'ngx-log-chat-detail',
  templateUrl: './log-chat-detail.component.html',
  styleUrls: ['./log-chat-detail.component.scss'],
})
export class LogChatDetailComponent implements OnInit, OnChanges {
  fromDate: Date;
  toDate: Date;
  @ViewChild('dialog') dialogTemplate: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;
  @ViewChild('templateList') templateList: LogChatTemplateListComponent;

  fromDateCtrl = new FormControl();
  toDateCtrl = new FormControl();
  userName: string;
  userId: string;

  constructor(
    private dialogService: NbDialogService,
  ) {}

  ngOnChanges(c: SimpleChanges) {}

  ngOnInit(): void {
    this.setValidates();
  }
/*  updateFromDate() {
    this.fromDate.setHours(0);
    this.fromDate.setMinutes(0);
    this.fromDate.setSeconds(0);
    this.fromDate.setMilliseconds(0);
  }
  updateToDate() {
    this.toDate.setHours(23);
    this.toDate.setMinutes(59);
    this.toDate.setSeconds(59);
    this.toDate.setMilliseconds(59);
  }*/

  setValidates() {
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

  open(userId: string, userName: string, createDate: Date) {
    this.userId = userId;
    this.userName = userName;
    this.fromDate = new Date(createDate);
    this.fromDateCtrl.setValue(this.fromDate);
    this.toDate = new Date(createDate);
    this.toDateCtrl.setValue(this.toDate);
    this.dialogRef = this.dialogService.open(this.dialogTemplate, { dialogClass: 'w98' });
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

  reload() {
    this.templateList.getLogTemplates();
  }
}
