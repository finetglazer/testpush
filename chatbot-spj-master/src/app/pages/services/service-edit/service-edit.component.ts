import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { IService, IServiceDetail, IServiceMapParam } from '../../../@core/models/service.model';
import { ServiceApiService } from '../../../@core/services/service-api.service';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AppConfigService } from '../../../shared/app-config.service';

@Component({
  selector: 'ngx-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.scss'],
})
export class ServiceEditComponent implements OnInit {
  @Input() disableStatusControl = false;
  @Output() onSuccess = new EventEmitter<{ action: string; service: IServiceDetail }>();
  @ViewChild('dialog') dialogTemplate: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;
  form: FormGroup;
  action: 'add' | 'edit' = 'add';
  submitted = false;

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private serviceApi: ServiceApiService,
    private simpleMessageService: SimpleMessageService,
    private translateService: TranslateService,
    private appConfig: AppConfigService,
  ) {}

  ngOnInit() {}

  get actionTitle() {
    return this.action === 'add'
      ? this.translateService.instant('Add service')
      : this.translateService.instant('Update service');
  }

  open(action: 'add' | 'edit', service?: IService) {
    this.action = action;
    if (this.action === 'edit') {
      this.serviceApi.getById(service && service.id).subscribe((s) => {
        this.buildForm(s);
        this.dialogRef = this.dialogService.open(this.dialogTemplate);
      });
    } else {
      this.buildForm();
      this.dialogRef = this.dialogService.open(this.dialogTemplate);
    }
    this.dialogRef.onClose.subscribe(() => (this.submitted = false));
  }

  get fc() {
    return this.form.controls;
  }

  get mapServiceParams() {
    return this.form && (this.form.get('mapServiceParams') as FormArray);
  }

  onFormSubmit() {
    this.submitted = true;
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }

    const data = {
      services: { ...this.form.value },
      mapServiceParams: this.fc.mapServiceParams.value,
    };
    delete data.services.mapServiceParams;
    data.services.inputUseFreemaker = data.services.inputUseFreemaker ? 1 : 0;
    data.services.status = data.services.status ? 1 : 0;
    data.services.isEscape = data.services.isEscape ? 1 : 0;
    data.services.botCode = this.appConfig.loadBotCode();

    const onSuccess = (res: IServiceDetail) => {
      this.dialogRef.close();
      const msg =
        this.action === 'edit'
          ? this.translateService.instant('Service successfully updated')
          : this.translateService.instant('Service successfully created');
      this.simpleMessageService.success(msg);
      this.onSuccess.emit({ action: this.action, service: res });
      this.submitted = false;
      this.form.reset();
    };
    const onError = (err) => {
      this.simpleMessageService.error(err);
    };
    if (this.action === 'edit') {
      this.serviceApi.update(data).subscribe(onSuccess, onError);
    } else {
      this.serviceApi.create(data).subscribe(onSuccess, onError);
    }
  }

  buildForm(sd: IServiceDetail = {} as IServiceDetail) {
    const service = sd.services || ({} as IService);
    sd.mapServiceParams = sd.mapServiceParams || [];
    this.form = this.fb.group({
      id: [service.id],
      serviceCode: [
        service.serviceCode,
        [Validators.required, Validators.maxLength(200), Validators.pattern('[a-zA-Z0-9-_.]+')],
      ],
      url: [service.url, [Validators.required, Validators.maxLength(600)]],
      request: [service.request, Validators.maxLength(4000)],
      description: [service.description, Validators.maxLength(200)],
      project: [service.project, Validators.required],
      response: [service.response, Validators.maxLength(4000)],
      status: [this.statusOrDefaultStatus(service.status, true), Validators.required],
      authType: [service.authType],
      userNameValue: [service.userNameValue, Validators.maxLength(100)],
      passwordValue: [service.passwordValue, Validators.maxLength(100)],
      method: [service.method],
      contentType: [service.contentType],
      type: [service.type, Validators.required],
      isEscape: [service.isEscape === 1 ? true : false, Validators.required],
      inputUseFreemaker: [service.inputUseFreemaker === 1 ? true : false, Validators.required],
      urlTest: [service.urlTest, [Validators.required, Validators.maxLength(600)]],
      env: [service.env, Validators.required],
      mapServiceParams: this.fb.array(sd.mapServiceParams.map((p) => this.createServiceParamMappingGroup(p))),
    });
    if (this.action === 'add') {
      this.addMapping();
    }
    this.fc.authType.valueChanges.subscribe((value) => {
      if (value) {
        this.fc.userNameValue.setValidators([Validators.required, Validators.maxLength(100)]);
        this.fc.passwordValue.setValidators([Validators.required, Validators.maxLength(100)]);
      } else {
        this.fc.userNameValue.clearValidators();
        this.fc.passwordValue.clearValidators();
        this.fc.userNameValue.setValidators(Validators.maxLength(100));
        this.fc.passwordValue.setValidators(Validators.maxLength(100));
      }
      this.fc.userNameValue.updateValueAndValidity();
      this.fc.passwordValue.updateValueAndValidity();
    });
  }

  addMapping() {
    this.mapServiceParams.push(this.createServiceParamMappingGroup());
  }

  duplicateMapping(pos: number) {
    const newMapping = this.createServiceParamMappingGroup(this.mapServiceParams.at(pos).value);
    this.mapServiceParams.push(newMapping);
  }

  removeMapping(pos: number) {
    this.mapServiceParams.removeAt(pos);
    this.mapServiceParams.controls.forEach((c) => c.get('businessParam').updateValueAndValidity());
  }

  private createServiceParamMappingGroup(p: IServiceMapParam = {} as IServiceMapParam) {
    return this.fb.group({
      businessParam: [p.businessParam, [Validators.required, Validators.maxLength(200), RxwebValidators.unique()]],
      botParam: [p.botParam, Validators.maxLength(200)],
      location: [p.location, Validators.required],
      defaultValue: [p.defaultValue, Validators.maxLength(200)],
      type: [p.type || 1, Validators.required],
    });
  }

  private statusOrDefaultStatus(status: number | null, defaultValue: boolean) {
    return status == null ? defaultValue : status === 1 ? true : false;
  }
}
