import { Component, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'ngx-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  constructor(private ngSelectConfig: NgSelectConfig) {
    this.ngSelectConfig.appendTo = 'body';
  }

  ngOnInit(): void {}
}
