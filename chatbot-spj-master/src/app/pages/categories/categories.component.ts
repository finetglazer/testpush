import { Component, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'ngx-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  constructor(private ngSelectConfig: NgSelectConfig) {
    this.ngSelectConfig.appendTo = 'body';
  }

  ngOnInit(): void {}
}
