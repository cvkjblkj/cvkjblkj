import { AlarmService } from './../shared/alarmService';

import { Component, OnInit, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'alarm',
  templateUrl: 'alarm.component.html',
  styleUrls: ['./alarm.component.scss']
})

export class AlarmComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    public alarmService: AlarmService,
    public route: ActivatedRoute,
  ) {

  }
  @Output() onVoted = new EventEmitter<boolean>();
  public alarmRuleStatus: boolean;
  public tab: boolean = true;
  public alarmRuleState: any;
  public alarmHistorystate: any;
  public routeId: any;//按钮id
  public ruleName: any
  public id: any;
  ngOnInit() {

    this.alarmRuleState = this.router.url.indexOf('alarm-rule');
    this.alarmHistorystate = this.router.url.indexOf('alarm-history');
    this.id = this.route.queryParams['value'].id ? this.route.queryParams['value'].id : this.route.params['value'].id;

    //检测点击样式
    this.route.queryParams.subscribe((params: Params) => {

      if (params['ruleName']) {
        this.alarmRuleState = -1;
        this.alarmHistorystate = 1;
      }
    });

  };
  public click() {
    this.tab = false;
    let id = {
      id: this.id
    }
    this.router.navigate(['/alarm-manage/create-rule'], { queryParams: id });
  };
  public alarmRule() {
    this.alarmRuleState = 1;
    this.alarmHistorystate = -1;
    var urls = this.router.url.slice(0, this.router.url.indexOf('alarm-manage')) + 'alarm-manage/alarm/alarm-rule';
    let id = {
      id: this.id
    }
    this.router.navigate([urls], { queryParams: id });
  };
  public alarmHistory() {
    this.alarmRuleState = -1;
    this.alarmHistorystate = 1;
    var urls = this.router.url.slice(0, this.router.url.indexOf('alarm-manage')) + 'alarm-manage/alarm/alarm-history';
    let id = {
      id: this.id
    }
    this.router.navigate([urls], { queryParams: id });

  };
  ngAfterViewInit() {


  }
}
