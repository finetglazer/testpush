import {
  Component,
  OnInit,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  Injector,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl, FormControl, AbstractControl } from '@angular/forms';
import { ICategoryItem } from '../../../@core/models/category.model';
import { CategoryApiService } from '../../../@core/services/category-api.service';

@Component({
  selector: 'ngx-service-content-type-select',
  templateUrl: './service-content-type-select.component.html',
  styleUrls: ['./service-content-type-select.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ServiceContentTypeSelectComponent), multi: true },
  ],
})
export class ServiceContentTypeSelectComponent implements OnInit, AfterViewInit {
  @Input() contentTypeValue: string;
  @Output() onContentTypeValueChange = new EventEmitter<string>();
  @Input() isInvalid = false;
  @Input() firstOptionAsDefault = false;
  @Input() submitted = false;

  contentTypes: ICategoryItem[] = [];
  selected: ICategoryItem;

  ctrl: AbstractControl;
  private _onChange: (value: any) => void;
  private _onTouch: () => void;

  constructor(
    private catApiService: CategoryApiService,
    private injector: Injector,
    private cdr: ChangeDetectorRef,
  ) {}

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
    this.catApiService.getContentTypes().subscribe((items) => {
      this.contentTypes = items;
      this.selected = this.contentTypes.find((p) => p.itemValue === this.contentTypeValue);
      if (this.firstOptionAsDefault) {
        this.selected = this.contentTypes[0];
        this._onChange(this.contentTypes[0].itemValue);
      }
    });
  }

  handleContentTypeChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.itemValue);
    }
    this.onContentTypeValueChange.emit(this.selected && this.selected.itemValue);
  }

  writeValue(obj: any): void {
    this.contentTypeValue = obj;
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
