import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-custom-bootstrap-table',
  templateUrl: './custom-bootstrap-table.component.html',
  styleUrls: ['./custom-bootstrap-table.component.scss'],
})
export class CustomBootstrapTableComponent implements OnInit {
  @Input() clazz: string = '';

  constructor() {}

  ngOnInit(): void {}
}
