import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ITemplate, ITemplateDetail, IMapTemplateService } from '../../../@core/models/template.model';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import { TemplateApiService } from '../../../@core/services/template-api.service';
import { IService, IServiceDetail } from '../../../@core/models/service.model';
import { ServiceApiService } from '../../../@core/services/service-api.service';
import { TemplateServiceSelectComponent } from '../template-service-select/template-service-select.component';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from '../../../shared/app-config.service';

@Component({
  selector: 'ngx-template-edit',
  templateUrl: './template-edit.component.html',
  styleUrls: ['./template-edit.component.scss'],
})
export class TemplateEditComponent implements OnInit {
  @Output() onSuccess = new EventEmitter();
  @ViewChild('dialog') dialogTemplate: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;
  form: FormGroup;
  action: 'add' | 'edit' = 'add';
  submitted = false;
  selectedServiceId: number;
  services: IService[] = [];
  @ViewChild('serviceSelector') serviceSelector: TemplateServiceSelectComponent;

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private templateApi: TemplateApiService,
    private serviceApi: ServiceApiService,
    private simpleMessageService: SimpleMessageService,
    private translateService: TranslateService,
    private appConfig: AppConfigService,
  ) {}

  ngOnInit() {}

  get actionTitle() {
    return this.action === 'add'
      ? this.translateService.instant('Add template')
      : this.translateService.instant('Update template');
  }

  open(action: 'add' | 'edit', template?: ITemplate) {
    this.action = action;
    this.serviceApi.getAll().subscribe((services) => {
      this.services = services;
      if (this.action === 'edit') {
        this.templateApi.getById(template && template.id).subscribe((s) => {
          this.buildForm(s);
          this.dialogRef = this.dialogService.open(this.dialogTemplate);
        });
      } else {
        this.buildForm();
        this.dialogRef = this.dialogService.open(this.dialogTemplate);
        this.dialogRef.onClose.subscribe(() => (this.submitted = false));
      }
    });
  }

  get fc() {
    return this.form.controls;
  }

  get mapTemplateService() {
    return this.form.get('mapTemplateService') as FormArray;
  }

  onFormSubmit() {
    this.submitted = true;
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }

    const data = {
      template: { ...this.form.value },
      mapTemplateService: this.fc.mapTemplateService.value,
    };
    delete data.template.mapTemplateService;
    data.template.status = data.template.status ? 1 : 0;
    data.template.botCode = this.appConfig.loadBotCode();
    data.mapTemplateService = (data.mapTemplateService as any[]).map((x, idx) => ({
      serviceId: x.serviceId,
      ord: x.ord,
    }));
    const onSuccess = () => {
      this.dialogRef.close();
      const msg =
        this.action === 'edit'
          ? this.translateService.instant('Template successfully updated')
          : this.translateService.instant('Template successfully created');
      this.simpleMessageService.success(msg);
      this.onSuccess.emit();
      this.submitted = false;
      this.form.reset();
      this.selectedServiceId = null;
    };
    const onError = (err) => {
      this.simpleMessageService.error(err);
    };
    if (this.action === 'edit') {
      this.templateApi.update(data).subscribe(onSuccess, onError);
    } else {
      this.templateApi.create(data).subscribe(onSuccess, onError);
    }
  }

  buildForm(sd: ITemplateDetail = {} as ITemplateDetail) {
    const template = sd.template || ({} as ITemplate);
    sd.mapTemplateService = sd.mapTemplateService || [];
    this.form = this.fb.group({
      id: [template.id],
      templateCode: [
        template.templateCode,
        [Validators.required, Validators.maxLength(200), Validators.pattern('[a-zA-Z0-9-_.]+')],
      ],
      description: [template.description, Validators.maxLength(200)],
      freemakerOutput: [template.freemakerOutput, Validators.required],
      status: [template.status, Validators.required],
      clazz: [template.clazz, Validators.required],
      mapTemplateService: this.fb.array(
        sd.mapTemplateService
          .filter((m) => {
            const s = this.services.find((x) => x.id === m.serviceId);
            return s ? true : false;
          })
          .map((p) => this.createTemplateServiceMappingGroup(p)),
      ),
    });
  }

  removeServiceMap(pos: number) {
    this.mapTemplateService.removeAt(pos);
  }

  selectService() {
    const exists = (this.mapTemplateService.value as Array<any>).find((x) => x.serviceId === this.selectedServiceId);
    if (this.selectedServiceId && !exists) {
      this.mapTemplateService.push(this.createTemplateServiceMappingGroup({ serviceId: this.selectedServiceId }));
    }
  }

  handleAfterServiceCreated({ action, service }: { action: string; service: IServiceDetail }) {
    this.serviceApi.getAll().subscribe((services) => {
      this.services = services;
      this.selectedServiceId = service.services.id;
      const idx = (this.mapTemplateService.value as Array<any>).findIndex(
        (x) => x.serviceId === this.selectedServiceId,
      );
      const newCtrl = this.createTemplateServiceMappingGroup({ serviceId: this.selectedServiceId });
      if (idx === -1) {
        this.mapTemplateService.push(newCtrl);
        this.serviceSelector.fetch();
      } else {
        this.mapTemplateService.at(idx).setValue({ ...newCtrl.value });
      }
    });
  }

  private createTemplateServiceMappingGroup(p: Partial<IMapTemplateService> = {} as Partial<IMapTemplateService>) {
    const s = this.services.find((x) => x.id === p.serviceId);
    return this.fb.group({
      serviceId: [s.id],
      ord: [p.ord, Validators.required],
      url: [s.url],
      serviceCode: [s.serviceCode],
      project: [s.project],
      request: [s.request],
      type: [s.type],
      method: [s.method],
      status: [s.status],
      updateUser: [s.updateUser],
      updateTime: [s.updateTime],
    });
  }
}
