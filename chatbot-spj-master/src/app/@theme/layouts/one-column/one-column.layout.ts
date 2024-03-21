import { Component } from '@angular/core';
import {AppConfigService} from '../../../shared/app-config.service';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar state="compacted" class="menu-sidebar" tag="menu-sidebar" responsive *ngIf="hasBot()">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ngx-breadcrumbs class="d-none"></ngx-breadcrumbs>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <!-- <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer> -->
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  constructor(private appConfig: AppConfigService) {}

  hasBot() {
    return this.appConfig.loadBotCode() != null;
  }
}
