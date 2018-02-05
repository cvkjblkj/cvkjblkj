import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import 'rxjs/add/operator/toPromise';

import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";
import { INCONFIG } from './../../../../core/global'; //引入API路径
import { Injectable } from '@angular/core';

@Injectable()
export class LoginJournalService {

  public token = INCONFIG.getToken();
  // public token = window.localStorage["jasToken"];
  constructor(private http: Http, private commonRequestMethodService: CommonRequestMethodService) {
  }

  /*获取登录日志中 图表所需的数据
  * "statisticsBegin": 开始时间
  * "statisticsEnd"  : 结束时间
  * filters          : 过滤条件
  * */
  getAppCountChart(statisticsBegin: any, statisticsEnd: any, filters: any, __this: any, successHandler: any): Promise<any> {
    let url = INCONFIG.journalServerSrc + "/log/login/v2/statistics/getCountByApp";
    let body = JSON.stringify({
      statisticsBegin: statisticsBegin,
      statisticsEnd: statisticsEnd,
      filters: filters,
    });
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /**
   * 获取用户登录区域的信息
   * @param params 请求数据{开始时间，结束时间，过滤参数}
   */
  getLoginAreaData(params: any, __this: any, successHandler: any) {
    let url = INCONFIG.journalServerSrc + "/log/login/v2/statistics/getCountByArea";
    let body = JSON.stringify(params);
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }


}
