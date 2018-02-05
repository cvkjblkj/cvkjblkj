import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-system-log',
  templateUrl: './system-log.component.html',
  styleUrls: ['./system-log.component.scss', './../journal-info.component.scss', './../business-log/business-log.component.scss']
})
export class SystemLogComponent implements OnInit, OnChanges {
  public routeQueryParams: any;//向子页面传的id值
  public id: any;
  public routeId: any;
  public routeStatesMaster: any;
  public routeStatesDocker: any;
  public routeStatesTomcat: any;
  public routeStatesNginx: any;
  public routeStatesMicroservices: any;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit() {

    this.routeId = this.route.queryParams['value'] ? this.route.queryParams['value'] : this.route.params['value'];
    this.routeStatesMaster = this.router.url.indexOf('MasterService');
    this.routeStatesDocker = this.router.url.indexOf('Docker')
    this.routeStatesTomcat = this.router.url.indexOf('Tomcat')
    this.routeStatesNginx = this.router.url.indexOf('Nginx')
    this.routeStatesMicroservices = this.router.url.indexOf('Microservices')

  }
  ngOnChanges() {

    // this.routeQueryParams = this.route.queryParams['value'] ? this.route.queryParams['value'] : this.route.params['value'];
  }

  public masterClick() {
    this.routeStatesMaster = 1;
    this.routeStatesDocker = -1;
    this.routeStatesTomcat = -1
    this.routeStatesNginx = -1
    this.routeStatesMicroservices = -1
    var urls = this.router.url.slice(0, this.router.url.indexOf('system-log')) + 'system-log/MasterService';
    this.router.navigate([urls], { queryParams: JSON.parse(JSON.stringify(this.routeId).substring(0, 44) + '}') })

  }
  public dockerClick() {
    this.routeStatesMaster = -1;
    this.routeStatesDocker = 1;
    this.routeStatesTomcat = -1
    this.routeStatesNginx = -1
    this.routeStatesMicroservices = -1
    var urls = this.router.url.slice(0, this.router.url.indexOf('system-log')) + 'system-log/Docker';
    this.router.navigate([urls], { queryParams: JSON.parse(JSON.stringify(this.routeId).substring(0, 44) + '}') })
  }

  public tomcatClick() {
    this.routeStatesMaster = -1;
    this.routeStatesDocker = -1;
    this.routeStatesTomcat = 1
    this.routeStatesNginx = -1
    this.routeStatesMicroservices = -1
    var urls = this.router.url.slice(0, this.router.url.indexOf('system-log')) + 'system-log/Tomcat';
    this.router.navigate([urls], { queryParams: JSON.parse(JSON.stringify(this.routeId).substring(0, 44) + '}') })
  }
  public nginxClick() {
    this.routeStatesMaster = -1;
    this.routeStatesDocker = -1;
    this.routeStatesTomcat = -1
    this.routeStatesNginx = 1
    this.routeStatesMicroservices = -1
    var urls = this.router.url.slice(0, this.router.url.indexOf('system-log')) + 'system-log/Nginx';
    this.router.navigate([urls], { queryParams: JSON.parse(JSON.stringify(this.routeId).substring(0, 44) + '}') })
  }
  public microservicesClick() {
    this.routeStatesMaster = -1;
    this.routeStatesDocker = -1;
    this.routeStatesTomcat = -1
    this.routeStatesNginx = -1
    this.routeStatesMicroservices = 1
    var urls = this.router.url.slice(0, this.router.url.indexOf('system-log')) + 'system-log/Microservices';
    this.router.navigate([urls], { queryParams: JSON.parse(JSON.stringify(this.routeId).substring(0, 44) + '}') })
  }

}
