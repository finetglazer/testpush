import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogBoxComponent } from './confirmation-dialog-box/confirmation-dialog-box.component';
import { NbCardModule, NbButtonModule, NbThemeModule } from '@nebular/theme';
import { TruncatePipe } from './truncate.pipe';
import { CustomBootstrapTableComponent } from './custom-bootstrap-table/custom-bootstrap-table.component';
import { LangIconComponent } from './lang-icon/lang-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmationDialogBoxComponent, TruncatePipe, CustomBootstrapTableComponent, LangIconComponent],
  imports: [CommonModule, NbCardModule, NbButtonModule, NbThemeModule, TranslateModule],
  exports: [ConfirmationDialogBoxComponent, CustomBootstrapTableComponent, TruncatePipe, LangIconComponent],
  entryComponents: [ConfirmationDialogBoxComponent],
})
export class SharedModule {}
