import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ICategoryItem } from '../../../@core/models/category.model';
import { CategoryApiService } from '../../../@core/services/category-api.service';

@Component({
  selector: 'ngx-template-clazz-select',
  templateUrl: './template-clazz-select.component.html',
  styleUrls: ['./template-clazz-select.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TemplateClazzSelectComponent), multi: true },
  ],
})
export class TemplateClazzSelectComponent implements OnInit {
  @Input() clazzValue: string;
  @Output() onClazzValueChange = new EventEmitter<string>();
  @Input() firstOptionAsDefault = false;
  @Input() isInvalid = false;

  clazzes: Array<ICategoryItem> = [];
  selected: ICategoryItem;

  private _onChange: (value: any) => void;
  private _onTouch: () => void;

  constructor(private catApiService: CategoryApiService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.catApiService.getClazzes().subscribe((items) => {
      this.clazzes = items;
      this.selected = this.clazzes.find(p => p.itemValue === this.clazzValue);
      if (this.firstOptionAsDefault) {
        this.selected = this.clazzes[0];
        this._onChange(this.clazzes[0].itemValue);
      }
    });
  }

  handleClazzChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.itemValue);
    }
    this.onClazzValueChange.emit(this.selected && this.selected.itemValue);
  }

  writeValue(obj: any): void {
    this.clazzValue = obj;
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
