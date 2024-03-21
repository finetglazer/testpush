import {
  Component,
  OnInit,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  Injector,
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

interface IStatus {
  label: string;
  value: 0 | 1;
}

@Component({
  selector: 'ngx-category-status-select',
  templateUrl: './category-status-select.component.html',
  styleUrls: ['./category-status-select.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CategoryStatusSelectComponent), multi: true },
  ],
})
export class CategoryStatusSelectComponent implements OnInit, AfterViewInit {
  @Input() statusValue: number;
  @Output() onStatusValueChange = new EventEmitter<number>();
  @Input() firstOptionAsDefault = false;
  @Input() isInvalid = false;
  @Input() submitted = false;

  status: Array<IStatus> = [
    {
      label: this.translateService.instant('Active'),
      value: 1,
    },
    {
      label: this.translateService.instant('Inactive'),
      value: 0,
    },
  ];
  selected: IStatus;

  ctrl: AbstractControl;
  private _onChange: (value: any) => void;
  private _onTouch: () => void;

  constructor(private translateService: TranslateService, private injector: Injector, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.ctrl = ngControl.control;
    }
    this.selected = this.status.find((p) => p.value === this.statusValue);
    if (this.firstOptionAsDefault) {
        this.selected = this.status[0];
        this._onChange(this.status[0].value);
    }
    this.cdr.detectChanges();
  }

  handleStatusChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.value);
    }
    this.onStatusValueChange.emit(this.selected && this.selected.value);
  }

  writeValue(obj: any): void {
    this.statusValue = obj;
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
