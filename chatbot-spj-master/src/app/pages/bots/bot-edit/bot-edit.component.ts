import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { IBot } from '../../../@core/models/bot.models';
import { BotApiService } from '../../../@core/services/bot-api.service';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-bot-edit',
  templateUrl: './bot-edit.component.html',
  styleUrls: ['./bot-edit.component.scss'],
})
export class BotEditComponent implements OnInit {
  @Output() onSuccess = new EventEmitter<{ action: string; bot: IBot }>();
  @ViewChild('dialog') dialogTemplate: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;
  form: FormGroup;
  action: 'add' | 'edit' = 'add';
  submitted = false;

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private botApiService: BotApiService,
    private simpleMessageService: SimpleMessageService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {}

  get actionTitle() {
    return this.action === 'add'
      ? this.translateService.instant('Add bot')
      : this.translateService.instant('Update bot');
  }

  open(action: 'add' | 'edit', bot?: IBot) {
    this.action = action;
    if (this.action === 'edit') {
      this.botApiService.getById(bot && bot.id).subscribe((b) => {
        this.buildForm(b);
        this.dialogRef = this.dialogService.open(this.dialogTemplate);
      });
    } else {
      this.buildForm();
      this.dialogRef = this.dialogService.open(this.dialogTemplate);
      this.dialogRef.onClose.subscribe(() => (this.submitted = false));
    }
  }

  get fc() {
    return this.form.controls;
  }

  get mapServiceParams() {
    return this.form.get('mapServiceParams') as FormArray;
  }

  onFormSubmit() {
    this.submitted = true;
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    const onSuccess = (res: IBot) => {
      this.dialogRef.close();
      const msg =
        this.action === 'edit'
          ? this.translateService.instant('Bot successfully updated')
          : this.translateService.instant('Bot successfully created');
      this.simpleMessageService.success(msg);
      this.onSuccess.emit({ action: this.action, bot: res });
      this.submitted = false;
      this.form.reset();
    };
    const onError = (err) => {
      this.simpleMessageService.error(err);
    };
    if (this.action === 'edit') {
      this.botApiService.update(this.form.value).subscribe(onSuccess, onError);
    } else {
      this.botApiService.create(this.form.value).subscribe(onSuccess, onError);
    }
  }

  buildForm(bot: IBot = {} as IBot) {
    this.form = this.fb.group({
      id: [bot.id],
      botName: [bot.botName, Validators.required],
      botCode: [bot.botCode],
      language: [bot.language, Validators.required],
      description: [bot.description, Validators.required],
    });
  }
}
