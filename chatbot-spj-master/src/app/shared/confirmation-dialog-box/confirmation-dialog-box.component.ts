import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  TemplateRef,
} from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-confirmation-dialog-box',
  templateUrl: './confirmation-dialog-box.component.html',
  styleUrls: ['./confirmation-dialog-box.component.scss'],
})
export class ConfirmationDialogBoxComponent implements OnInit {
  @Input() type: 'success' | 'warning' | 'danger' | 'info' = 'success';
  @Input() title = 'Confirm';
  @Input() okText = 'OK';
  @Input() cancelText = 'Cancel';
  @Input() message: string;
  @Input() showCancelButton = true;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onOk = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCancel = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onDialogOpened = new EventEmitter<any>();

  @ViewChild('dialog', { static: true }) dialog: TemplateRef<any>;
  data: any;

  constructor(private dialogService: NbDialogService) {}

  ngOnInit() {}

  open(data?: any, message?: string) {
    this.data = data;
    this.message = message || this.message;
    const dialogRef = this.dialogService.open(this.dialog, {});

    this.onDialogOpened.emit();

    dialogRef.onClose.subscribe((ok) => {
      if (ok) {
        this.onOk.emit(data);
      } else {
        this.onCancel.emit(data);
      }
    });
    return false;
  }
}
