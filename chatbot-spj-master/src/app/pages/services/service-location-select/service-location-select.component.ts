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
import { NG_VALUE_ACCESSOR, NgControl, AbstractControl } from '@angular/forms';
import { ICategoryItem } from '../../../@core/models/category.model';
import { CategoryApiService } from '../../../@core/services/category-api.service';

@Component({
  selector: 'ngx-service-location-select',
  templateUrl: './service-location-select.component.html',
  styleUrls: ['./service-location-select.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ServiceLocationSelectComponent), multi: true },
  ],
})
export class ServiceLocationSelectComponent implements OnInit, AfterViewInit {
  @Input() locationValue: string;
  @Output() onLocationValueChange = new EventEmitter<string>();
  @Input() isInvalid = false;
  @Input() firstOptionAsDefault = false;
  @Input() submitted = false;

  locations: ICategoryItem[] = [];
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
    this.catApiService.getLocations().subscribe((items) => {
      this.locations = items;
      this.selected = this.locations.find((p) => p.itemValue === this.locationValue);
      if (this.firstOptionAsDefault && !this.selected) {
        this.selected = this.locations[0];
        this._onChange(this.locations[0].itemValue);
      }
    });
  }

  handleLocationChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.itemValue);
    }
    this.onLocationValueChange.emit(this.selected && this.selected.itemValue);
  }

  writeValue(obj: any): void {
    this.locationValue = obj;
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
