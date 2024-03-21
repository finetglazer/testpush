import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-lang-icon',
  templateUrl: './lang-icon.component.html',
  styleUrls: ['./lang-icon.component.scss'],
})
export class LangIconComponent implements OnInit {
  @Input() lang: 'en' | 'vi' | 'km' = 'en';
  @Input() showTitle = true;

  langMap = {
    en: {
      title: this.translateService.instant('English'),
      iconClass: 'mficon-flag-en',
    },
    vi: {
      title: this.translateService.instant('Vietnamese'),
      iconClass: 'mficon-flag-vi',
    },
    km: {
      title: this.translateService.instant('Khmer'),
      iconClass: 'mficon-flag-km',
    },
  };

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {}
}
