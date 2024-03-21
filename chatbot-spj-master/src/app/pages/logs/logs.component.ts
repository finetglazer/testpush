import { Component, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'ngx-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  constructor(private ngSelectConfig: NgSelectConfig) {
    this.ngSelectConfig.appendTo = 'body';
  }

  ngOnInit(): void {}
}
