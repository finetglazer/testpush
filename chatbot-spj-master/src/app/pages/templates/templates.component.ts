import { Component, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'ngx-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

  constructor(private ngSelectConfig: NgSelectConfig) {
    this.ngSelectConfig.appendTo = 'body';
  }

  ngOnInit(): void {
  }

}
