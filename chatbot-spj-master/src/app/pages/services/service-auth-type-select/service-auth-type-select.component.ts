import {
  Component,
  OnInit,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  Injector,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl, AbstractControl } from '@angular/forms';
import { ICategoryItem } from '../../../@core/models/category.model';
import { CategoryApiService } from '../../../@core/services/category-api.service';

@Component({
  selector: 'ngx-service-auth-type-select',
  templateUrl: './service-auth-type-select.component.html',
  styleUrls: ['./service-auth-type-select.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ServiceAuthTypeSelectComponent), multi: true },
  ],
})
export class ServiceAuthTypeSelectComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() authTypeValue: string;
  @Output() onAuthTypeValueChange = new EventEmitter<string>();
  @Input() firstOptionAsDefault = false;
  @Input() submitted = false;

  authTypes: ICategoryItem[] = [];
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

  ngOnChanges(c: SimpleChanges) {
  }

  fetch() {
    this.catApiService.getAuthTypes().subscribe((items) => {
      this.authTypes = items;
      this.selected = this.authTypes.find((p) => p.itemValue === this.authTypeValue);
      if (this.firstOptionAsDefault) {
        this.selected = this.authTypes[0];
        this._onChange(this.authTypes[0].itemValue);
      }
    });
  }

  handleAuthTypeChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.itemValue);
    }
    this.onAuthTypeValueChange.emit(this.selected && this.selected.itemValue);
  }

  writeValue(obj: any): void {
    this.authTypeValue = obj;
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
