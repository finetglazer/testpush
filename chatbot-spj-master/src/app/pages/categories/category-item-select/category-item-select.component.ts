import {
  Component,
  OnInit,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild,
  AfterViewInit,
  Injector,
  ChangeDetectorRef,
} from '@angular/core';
import { ICategoryItem } from '../../../@core/models/category.model';
import { NG_VALUE_ACCESSOR, AbstractControl, NgControl } from '@angular/forms';
import { CategoryApiService } from '../../../@core/services/category-api.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'ngx-category-item-select',
  templateUrl: './category-item-select.component.html',
  styleUrls: ['./category-item-select.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CategoryItemSelectComponent), multi: true }],
})
export class CategoryItemSelectComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() itemValue: number;
  @Output() onItemValueChange = new EventEmitter<number>();
  @Input() firstOptionAsDefault = false;
  @Input() isInvalid = false;
  @Input() categoryId: number;
  @Input() submitted = false;

  items: Array<ICategoryItem> = [];
  selected: ICategoryItem;

  ctrl: AbstractControl;
  private _onChange: (value: any) => void;
  private _onTouch: () => void;

  constructor(private catApiService: CategoryApiService, private injector: Injector, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.categoryId) {
      this.fetch();
    } else {
      this.items = [];
      this.selected = undefined;
      setTimeout(() => {
        this.handleCategoryItemChange();
      }, 0);
    }
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.ctrl = ngControl.control;
    }
    this.cdr.detectChanges();
  }

  fetch() {
    this.catApiService.findItemsByCategory(this.categoryId).subscribe((items) => {
      this.items = items;
      this.selected = this.items.find((p) => p.id === this.itemValue);
      if (this.firstOptionAsDefault) {
        this.selected = this.items[0];
        this._onChange(this.items[0].id);
      }
    });
  }

  handleCategoryItemChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.id);
    }
    this.onItemValueChange.emit(this.selected && this.selected.id);
  }

  writeValue(obj: any): void {
    this.itemValue = obj;
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
