import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { ThemeModule } from '../@theme/theme.module';
import { NbLayoutModule, NbAlertModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AuthComponent, LoginComponent],
  imports: [
    ThemeModule,
    NbLayoutModule,
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    NbAlertModule,
  ],
})
export class AuthModule {}
