import { Component } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  styleUrls: [],
  template: `
    <nb-layout>
      <nb-layout-column class="p-0">
        <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class AuthComponent {}
