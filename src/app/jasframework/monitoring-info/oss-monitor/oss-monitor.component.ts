import { FormsModule } from '@angular/forms';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'oss-monitor',
  templateUrl: './oss-monitor.component.html',
  styleUrls: ['./oss-monitor.component.scss']
})
export class OssMonitorComponent implements OnInit, AfterContentInit {
  public routeQueryParams: any;
  public item: boolean = true;
  public Active: boolean = false;
  public isActive: boolean = false;
  public isItem: boolean = true;
  public baseRoute: any;
  public handleRoute: any;
  public routeId: any = {};
  public routeStatesHierarchy: any;
  public routeStatesBuketchy: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.routeStatesHierarchy = this.router.url.indexOf('hierarchy');
    this.routeStatesBuketchy = this.router.url.indexOf('buketchy');
    this.routeId = this.route.queryParams['value'] ? this.route.queryParams['value'] : this.route.params['value'];

  }
  ngAfterContentInit() {

  }
  public baseClick() {
    this.routeStatesBuketchy = -1;
    this.routeStatesHierarchy = 1;
    var urls = this.router.url.slice(0, this.router.url.indexOf('oss-monitor')) + 'oss-monitor/hierarchy-monitor';
    this.router.navigate([urls], { queryParams: JSON.parse(JSON.stringify(this.routeId).substring(0, 44) + '}') })

  };
  public handleClick() {
    this.routeStatesBuketchy = 1;
    this.routeStatesHierarchy = -1;
    var urls = this.router.url.slice(0, this.router.url.indexOf('oss-monitor')) + 'oss-monitor/buketchy-monitor';
    this.router.navigate([urls], { queryParams: JSON.parse(JSON.stringify(this.routeId).substring(0, 44) + '}') })
  }
}
