import { Component, OnInit } from '@angular/core';
import { IBreadCrumbItem, BreadcrumbService } from '../../../shared/breadcrumb.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'ngx-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbItems: IBreadCrumbItem[] = [];
  pageTitle: string;

  constructor(private breadcrumbService: BreadcrumbService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.breadcrumbService.change$.subscribe(() => {
      this.breadcrumbItems = this.breadcrumbService.breadcrumbs;
      if (this.breadcrumbItems.findIndex(x => x.label === 'Home') === -1) {
        this.breadcrumbItems.unshift({ label: 'Home', active: false, path: '/' });
      }
    });
    this.pageTitle = this.extractPageTitle(this.route.root);
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.breadcrumbService.buildBreadcrumbs(this.route.root);
        this.pageTitle = this.extractPageTitle(this.route.root);
      }
    });
    // On reload
    this.breadcrumbService.buildBreadcrumbs(this.route.root);
  }

  extractPageTitle(route: ActivatedRoute) {
    let title: string;
    if (route.children.length === 0) {
      return title;
    }
    for (const child of route.children) {
      title = child.snapshot.data.pageTitle;
      return this.extractPageTitle(child) || title;
    }
  }
}
