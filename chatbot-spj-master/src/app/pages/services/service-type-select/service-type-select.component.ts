import {
  Component,
  OnInit,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  Injector,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl, AbstractControl } from '@angular/forms';
import { ICategoryItem } from '../../../@core/models/category.model';
import { CategoryApiService } from '../../../@core/services/category-api.service';

@Component({
  selector: 'ngx-service-type-select',
  templateUrl: './service-type-select.component.html',
  styleUrls: ['./service-type-select.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ServiceTypeSelectComponent), multi: true }],
})
export class ServiceTypeSelectComponent implements OnInit, AfterViewInit {
  @Input() typeValue: string;
  @Output() onTypeValueChange = new EventEmitter<string>();
  @Input() isInvalid = false;
  @Input() firstOptionAsDefault = false;
  @Input() submitted = false;

  serviceTypes: ICategoryItem[] = [];
  selected: ICategoryItem;

  ctrl: AbstractControl;
  private _onChange: (value: any) => void;
  private _onTouch: () => void;

  constructor(private catApiService: CategoryApiService, private injector: Injector, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.ctrl = ngControl.control;
    }
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.catApiService.getServiceTypes().subscribe((items) => {
      this.serviceTypes = items;
      this.selected = this.serviceTypes.find((p) => p.itemValue === this.typeValue);
      if (this.firstOptionAsDefault) {
        this.selected = this.serviceTypes[0];
        this._onChange(this.serviceTypes[0].itemValue);
      }
    });
  }

  handleTypeChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.itemValue);
    }
    this.onTypeValueChange.emit(this.selected && this.selected.itemValue);
  }

  writeValue(obj: any): void {
    this.typeValue = obj;
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
