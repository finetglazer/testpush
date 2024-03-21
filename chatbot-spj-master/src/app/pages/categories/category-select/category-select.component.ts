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
} from '@angular/core';
import { ICategory } from '../../../@core/models/category.model';
import { NG_VALUE_ACCESSOR, AbstractControl, NgControl } from '@angular/forms';
import { CategoryApiService } from '../../../@core/services/category-api.service';

@Component({
  selector: 'ngx-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CategorySelectComponent), multi: true }],
})
export class CategorySelectComponent implements OnInit, AfterViewInit {
  @Input() categoryValue: number;
  @Output() onCategoryValueChange = new EventEmitter<number>();
  @Input() firstOptionAsDefault = false;
  @Input() isInvalid = false;
  @Input() submitted = false;

  categories: Array<ICategory> = [];
  selected: ICategory;

  ctrl: AbstractControl;
  private _onChange: (value: any) => void;
  private _onTouch: () => void;

  constructor(private catApiService: CategoryApiService, private injector: Injector, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetch();
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.ctrl = ngControl.control;
    }
    this.cdr.detectChanges();
  }

  fetch() {
    this.catApiService.getCategories().subscribe((items) => {
      this.categories = items;
      this.selected = this.categories.find((p) => p.id === this.categoryValue);
      if (this.firstOptionAsDefault) {
        this.selected = this.categories[0];
        this._onChange(this.categories[0].id);
      }
    });
  }

  handleCategoryChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.id);
    }
    this.onCategoryValueChange.emit(this.selected && this.selected.id);
  }

  writeValue(obj: any): void {
    this.categoryValue = obj;
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
