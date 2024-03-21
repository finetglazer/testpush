import {
  Component,
  OnInit,
  forwardRef,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
  Injector,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl } from '@angular/forms';
import { CategoryApiService } from '../../../@core/services/category-api.service';
import { ICategoryItem } from '../../../@core/models/category.model';

@Component({
  selector: 'ngx-service-method-select',
  templateUrl: './service-method-select.component.html',
  styleUrls: ['./service-method-select.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ServiceMethodSelectComponent), multi: true }],
})
export class ServiceMethodSelectComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  @Input() methodValue: string;
  @Output() onMethodValueChange = new EventEmitter<string>();
  @Input() isInvalid = false;
  @Input() firstOptionAsDefault = false;
  @Input() submitted = false;

  methods: ICategoryItem[] = [];
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
    this.catApiService.getMethods().subscribe((items) => {
      this.methods = items;
      this.selected = this.methods.find((p) => p.itemValue === this.methodValue);
      if (this.firstOptionAsDefault) {
        this.selected = this.methods[0];
        this._onChange(this.methods[0].itemValue);
      }
    });
  }

  handleMethodChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.itemValue);
    }
    this.onMethodValueChange.emit(this.selected && this.selected.itemValue);
  }

  writeValue(obj: any): void {
    this.methodValue = obj;
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
