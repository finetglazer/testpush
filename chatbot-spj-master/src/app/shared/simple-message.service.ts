import {
  Injectable,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { ConfirmationDialogBoxComponent } from './confirmation-dialog-box/confirmation-dialog-box.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SimpleMessageService {
  private vcr: ViewContainerRef;
  private modalRef: ComponentRef<ConfirmationDialogBoxComponent>;
  private instance: ConfirmationDialogBoxComponent;

  constructor(
    private cmpFactory: ComponentFactoryResolver,
    private translateService: TranslateService,
  ) {}

  info(message: string, callBack?: any) {
    this.precheck();
    this.instance.type = 'info';
    this.instance.title = this.translateService.instant('Info');
    this.instance.message = message;
    this.instance.onOk.subscribe(() => {
      if (callBack) {
        callBack();
      }
    });
    this.instance.open();
  }

  success(message: string, callBack?: any) {
    this.precheck();
    this.instance.type = 'success';
    this.instance.title = this.translateService.instant('Success');
    this.instance.message = message;
    this.instance.onOk.subscribe(() => {
      if (callBack) {
        callBack();
      }
    });
    this.instance.open();
  }

  warning(message: string, title: string = 'Warning') {
    this.precheck();
    this.instance.type = 'warning';
    this.instance.title = this.translateService.instant(title);
    this.instance.message = message;
    this.instance.open();
  }

  error(message: string, title: string = 'Error') {
    this.precheck();
    this.instance.type = 'danger';
    this.instance.title = this.translateService.instant(title);
    this.instance.message = message;
    this.instance.open();
  }

  setRootContainerRef(vcr: ViewContainerRef) {
    this.vcr = vcr;
  }

  private precheck() {
    if (!this.modalRef) {
      const factory = this.cmpFactory.resolveComponentFactory(
        ConfirmationDialogBoxComponent,
      );
      this.modalRef = this.vcr.createComponent(factory);
      this.instance = this.modalRef.instance;
      this.instance.showCancelButton = false;
    }
  }
}
