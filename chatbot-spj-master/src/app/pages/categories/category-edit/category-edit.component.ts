import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ICategoryItem } from '../../../@core/models/category.model';
import { CategoryApiService } from '../../../@core/services/category-api.service';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { SimpleMessageService } from '../../../shared/simple-message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss'],
})
export class CategoryEditComponent implements OnInit {
  @Output() onSuccess = new EventEmitter<{ action: string; categoryItem: ICategoryItem }>();
  @ViewChild('dialog') dialogTemplate: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;
  form: FormGroup;
  action: 'add' | 'edit' = 'add';
  submitted = false;

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private catItemApi: CategoryApiService,
    private simpleMessageService: SimpleMessageService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {}

  get actionTitle() {
    return this.action === 'add'
      ? this.translateService.instant('Add category item')
      : this.translateService.instant('Update category item');
  }

  open(action: 'add' | 'edit', catItem?: ICategoryItem) {
    this.action = action;
    if (this.action === 'edit') {
      this.catItemApi.getById(catItem && catItem.id).subscribe((s) => {
        this.buildForm(s);
        this.dialogRef = this.dialogService.open(this.dialogTemplate);
      });
    } else {
      this.buildForm();
      this.dialogRef = this.dialogService.open(this.dialogTemplate);
      this.dialogRef.onClose.subscribe(() => (this.submitted = false));
    }
  }

  get fc() {
    return this.form.controls;
  }

  get mapServiceParams() {
    return this.form.get('mapServiceParams') as FormArray;
  }

  onFormSubmit() {
    this.submitted = true;
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    const onSuccess = (res: ICategoryItem) => {
      this.dialogRef.close();
      const msg =
        this.action === 'edit'
          ? this.translateService.instant('Category item successfully updated')
          : this.translateService.instant('Category item successfully created');
      this.simpleMessageService.success(msg);
      this.onSuccess.emit({ action: this.action, categoryItem: res });
      this.submitted = false;
      this.form.reset();
    };
    const onError = (err) => {
      this.dialogRef.close();
      this.simpleMessageService.error(err);
    };
    if (this.action === 'edit') {
      this.catItemApi.update(this.form.value).subscribe(onSuccess, onError);
    } else {
      this.catItemApi.create(this.form.value).subscribe(onSuccess, onError);
    }
  }

  buildForm(catItem: ICategoryItem = {} as ICategoryItem) {
    this.form = this.fb.group({
      id: [catItem.id],
      itemName: [catItem.itemName, [Validators.required, Validators.maxLength(200)]],
      itemCode: [catItem.itemCode, [Validators.required, Validators.maxLength(200)]],
      categoryId: [catItem.categoryId, Validators.required],
      itemValue: [catItem.itemValue, [Validators.required, Validators.maxLength(200)]],
      status: [catItem.status, Validators.required],
      categoryParentId: [catItem.categoryParentId],
      parentId: [catItem.parentId],
      description: [catItem.description, Validators.maxLength(300)],
      position: [catItem.position],
    });
    this.fc.categoryParentId.valueChanges.subscribe((v) => {
      if (v != null) {
        this.fc.parentId.setValidators(Validators.required);
      } else {
        this.fc.parentId.clearValidators();
      }
      this.fc.parentId.updateValueAndValidity();
    });
  }
}
