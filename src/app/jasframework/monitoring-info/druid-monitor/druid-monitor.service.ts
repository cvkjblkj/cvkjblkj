import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import 'rxjs/add/operator/toPromise';

import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";
import { Injectable } from '@angular/core';
import { INCONFIG } from './../../../core/global';

@Injectable()
export class DruidMonitorServer {
  constructor(private http: Http, private commonRequestMethodService: CommonRequestMethodService) {
  }

  /* 获取数据源数据
   * pageNum: 分页的第几页
   * pageSize: 每页有多少条数据
   * filters: 筛选条件
   * http://192.168.100.90:8050/cloudlink-core-log/log/druid/v2/datasource/queryList
   * */
  getDataSource(pageNum: any, pageSize: any, filters: any, __this: any, successHandler: any): Promise<any> {
    let url = INCONFIG.journalServerSrc + "/log/druid/v2/datasource/queryList";
    let body = JSON.stringify({
      pageNum: pageNum.toString(),
      pageSize: pageSize.toString(),
      filters: filters,
      orderBy: 'createTime desc', //排序规则
    });
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /* 获取SQL监控数据
   * pageNum: 分页的第几页
   * pageSize: 每页有多少条数据
   * filters: 筛选条件
   * */
  getSQLMonitor(pageNum: any, pageSize: any, filters: any, __this: any, successHandler: any): Promise<any> {
    let url = INCONFIG.journalServerSrc + "/log/druid/v2/sql/queryList";
    let body = JSON.stringify({
      pageNum: pageNum.toString(),
      pageSize: pageSize.toString(),
      filters: filters,
      orderBy: 'createTime desc', //排序规则
    });
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /* 获取URI监控数据
   * pageNum: 分页的第几页
   * pageSize: 每页有多少条数据
   * filters: 筛选条件
   * */
  getURIMonitor(pageNum: any, pageSize: any, filters: any, __this: any, successHandler: any): Promise<any> {
    let url = INCONFIG.journalServerSrc + "/log/druid/v2/weburi/queryList";
    let body = JSON.stringify({
      pageNum: pageNum.toString(),
      pageSize: pageSize.toString(),
      filters: filters,
      orderBy: 'createTime desc', //排序规则
    });
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /*获取搜索用的 服务名与端口号
   *
   * */
  getServiceNameCount(__this: any, successHandler: any): Promise<any> {
    let url = INCONFIG.journalServerSrc + "/log/druid/v2/datasource/statistics/getServiceNameCount";
    let body = {};
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }


}
