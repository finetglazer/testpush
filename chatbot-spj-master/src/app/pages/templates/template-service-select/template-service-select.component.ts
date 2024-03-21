import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { IService } from '../../../@core/models/service.model';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ServiceApiService } from '../../../@core/services/service-api.service';

@Component({
  selector: 'ngx-template-service-select',
  templateUrl: './template-service-select.component.html',
  styleUrls: ['./template-service-select.component.scss'],

  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TemplateServiceSelectComponent), multi: true },
  ],
})
export class TemplateServiceSelectComponent implements OnInit {
  @Input() serviceValue: number;
  @Output() onServiceValueChange = new EventEmitter<number>();
  @Input() firstOptionAsDefault = false;
  @Input() isInvalid = false;

  services: Array<IService> = [];
  selected: IService;

  private _onChange: (value: any) => void;
  private _onTouch: () => void;

  constructor(private serviceApi: ServiceApiService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.serviceApi.getAll().subscribe((items) => {
      this.services = items;
      this.selected = this.services.find((p) => p.id === this.serviceValue);
      if (this.firstOptionAsDefault) {
        this.selected = this.services[0];
        this._onChange(this.services[0].id);
      }
    });
  }

  handleServiceChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.id);
    }
    this.onServiceValueChange.emit(this.selected && this.selected.id);
  }

  writeValue(obj: any): void {
    this.serviceValue = obj;
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
}
