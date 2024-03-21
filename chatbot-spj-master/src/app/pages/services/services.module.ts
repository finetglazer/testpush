import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceEditComponent } from './service-edit/service-edit.component';
import { SharedModule } from '../../shared/shared.module';
import {
    NbCardModule,
    NbSelectModule,
    NbButtonModule,
    NbInputModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbIconModule,
    NbToggleModule, NbTooltipModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbPaginationModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceTypeSelectComponent } from './service-type-select/service-type-select.component';
import { ServiceMethodSelectComponent } from './service-method-select/service-method-select.component';
import { ServiceProjectSelectComponent } from './service-project-select/service-project-select.component';
import { ServiceContentTypeSelectComponent } from './service-content-type-select/service-content-type-select.component';
import { ServiceAuthTypeSelectComponent } from './service-auth-type-select/service-auth-type-select.component';
import { ServiceLocationSelectComponent } from './service-location-select/service-location-select.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ServicesComponent,
    ServiceListComponent,
    ServiceEditComponent,
    ServiceTypeSelectComponent,
    ServiceMethodSelectComponent,
    ServiceProjectSelectComponent,
    ServiceContentTypeSelectComponent,
    ServiceAuthTypeSelectComponent,
    ServiceLocationSelectComponent,
  ],
    imports: [
        CommonModule,
        ServicesRoutingModule,
        SharedModule,
        ThemeModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        NbSelectModule,
        NbIconModule,
        NbToggleModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        TranslateModule,
        NgSelectModule,
        NbTooltipModule,
        NgbTooltipModule,
    ],
  exports: [ServiceEditComponent],
})
export class ServicesModule {}
