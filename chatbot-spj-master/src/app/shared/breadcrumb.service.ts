import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface IBreadCrumbItem {
  label: string;
  path: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // tslint:disable-next-line: variable-name
  private _breadcrumbItems: IBreadCrumbItem[] = [];

  change$ = new Subject();

  constructor() {}

  get breadcrumbs() {
    return this._breadcrumbItems;
  }

  setBreadcrumbs(items: IBreadCrumbItem[] = []) {
    this._breadcrumbItems = items;
    this.notifyChange();
  }

  buildBreadcrumbs(root: ActivatedRoute) {
    this._breadcrumbItems = this.extractBreadcrumbs(root);
    this.notifyChange();
  }

  prepend(item: IBreadCrumbItem) {
    if (item.active) {
      this._breadcrumbItems.forEach((b) => (b.active = false));
    }
    this._breadcrumbItems.unshift(item);
    this.notifyChange();
  }

  append(item: IBreadCrumbItem) {
    if (item.active) {
      this._breadcrumbItems.forEach((b) => (b.active = false));
    }
    this._breadcrumbItems.push(item);
    this.notifyChange();
  }

  private notifyChange() {
    this.change$.next(this._breadcrumbItems);
  }

  private extractBreadcrumbs(
    route: ActivatedRoute,
    currentPath = '',
    breadcrumbs: IBreadCrumbItem[] = [],
  ): IBreadCrumbItem[] {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      const last = breadcrumbs[breadcrumbs.length - 1];
      if (last) {
        last.active = false;
      }
      return breadcrumbs;
    }
    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        currentPath += `/${routeURL}`;
      }
      const label = child.snapshot.data.breadcrumb;
      if (label) {
        breadcrumbs.push({ label, path: currentPath, active: false });
      }
      return this.extractBreadcrumbs(child, currentPath, breadcrumbs);
    }
  }
}
