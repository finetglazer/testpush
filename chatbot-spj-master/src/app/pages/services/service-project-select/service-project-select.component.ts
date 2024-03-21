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
import { NG_VALUE_ACCESSOR, AbstractControl, NgControl } from '@angular/forms';
import { ICategoryItem } from '../../../@core/models/category.model';
import { CategoryApiService } from '../../../@core/services/category-api.service';

@Component({
  selector: 'ngx-service-project-select',
  templateUrl: './service-project-select.component.html',
  styleUrls: ['./service-project-select.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ServiceProjectSelectComponent), multi: true },
  ],
})
export class ServiceProjectSelectComponent implements OnInit, AfterViewInit {
  @Input() projectValue: string;
  @Output() onProjectValueChange = new EventEmitter<string>();
  @Input() firstOptionAsDefault = false;
  @Input() isInvalid = false;
  @Input() submitted = false;

  projects: Array<ICategoryItem> = [];
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
    this.catApiService.getProjects().subscribe((items) => {
      this.projects = items;
      this.selected = this.projects.find((p) => p.itemValue === this.projectValue);
      if (this.firstOptionAsDefault) {
        this.selected = this.projects[0];
        this._onChange(this.projects[0].itemValue);
      }
    });
  }

  handleProjectChange() {
    if (this._onChange) {
      this._onChange(this.selected && this.selected.itemValue);
    }
    this.onProjectValueChange.emit(this.selected && this.selected.itemValue);
  }

  writeValue(obj: any): void {
    this.projectValue = obj;
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
