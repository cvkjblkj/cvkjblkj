import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { INCONFIG } from './../../../core/global';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import {CommonService} from './../../../core/common-service/common.service'
@Injectable()
export class AlarmService {
  public serviceName = INCONFIG.monitorServerSrc;
  public dataServerSrc = INCONFIG.dataServerSrc;
  public button: any;// 下载按钮的值的集合
  public leftData: any;//报警规则通知人
  public rightData: any;//
  public status: boolean = false;
  constructor(
    public commonRequestMethodService: CommonRequestMethodService,
    public http: Http,
    public commonService:CommonService

  ) { }
  /**
   * 日志搜索过滤
   * @param url 请求地址
   * @param value 请求参数
   */
  public searchData(__this: any, url: any, value: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.serviceName + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler, errorhandler)
  };
  public getList(url: string, params?: any, __this?: any, successHandler?: any, errorHandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, __this, successHandler, errorHandler)
  }
  public editList(url: string, params?: any, __this?: any, successHandler?: any, errorHandler?: any) {
    let requestUrl = this.serviceName + url;
    this.commonRequestMethodService.doGet(requestUrl, params, __this, successHandler, errorHandler)
  }
  /**
 * docker监控部分的单位转换
 */
  public docerUnitConversion(unit, dataArr) {
    // console.log(unit);
    // console.log(dataArr);
    let bytes = 1;
    let K = 1024;
    let M = 1048576;
    let G = 1073741824;
    let T = 1099511627776;
    let P = T * 1024;
    let E = P * 1024;
    let Z = E * 1024;
    let Y = Z * 1024;
    let capacityCon = {
      bytes: bytes,
      K: K,
      M: M,
      G: G,
      T: T,
      P: P,
      E: E,
      Z: Z,
      Y: Y
    };  // 换算的值
    let relUnit;
    let relValue = [];
    let bit;  // 转换为 B 或者b
    if (!unit || (unit.indexOf('bits') !== -1 && unit.indexOf('bps') !== -1 && unit.indexOf('bytes') !== -1)) {

      // 没有单位 或者不需要转换单位
      console.log(unit);
      relUnit = unit ? unit : '';
      relValue = dataArr;
      // for (let itemData of dataArr) {
      //   for (let item of itemData.datas) {
      //     item = Number(item).toFixed(2);
      //   }
      // }
      return {
        'unit': relUnit,
        'value': dataArr
      }
    }
    if (unit.indexOf('bits') == -1 || unit.indexOf('bps') == -1 || unit.indexOf('bytes') == -1) {
      // bit 为单位
      bit = 'b';
    } else {
      // bytes 为单位
      bit = 'B';
    }
    if (dataArr.length == 1) {
      // 只有一条数据，取平均值为准
      let average = this.commonService.arrAverageNum(dataArr[0].datas);
      for (let key in capacityCon) {
        if (average / capacityCon[key] < 999) {
          relUnit = key;
          break;
        }
      }
    } else if (dataArr.length > 1) {
      // 有多条数据，取最小值为准
      let minArr = [];

      for (let item of dataArr) {

        let min = this.commonService.arrMinNum(item.datas);
        minArr.push(min);
      }
      let minValue = this.commonService.arrMinNum(minArr);

      for (let key in capacityCon) {
        // 单位的区间在 大于0.1 小于999

        if ((minValue / capacityCon[key] < 999 && minValue / capacityCon[key] > 0.1)) {
          relUnit = key;
          relUnit = relUnit + bit;
          break;
        } else {
          relUnit = unit;
        }
      }
    }

    for (let itemData of dataArr) {
      let lineData = [];
      for (let item of itemData.datas) {
        if (!capacityCon[relUnit]) {
          capacityCon[relUnit] = 1;
        }
        lineData.push((item / capacityCon[relUnit]).toFixed(2));
      }
      relValue.push({
        name: itemData.name,
        datas: lineData
      });
    }



    if (relUnit.indexOf('s') == -1) {
      if (unit === 'bytes/s') {
        relUnit = relUnit + '/s';
      } else if (unit === 'bits/s') {
        relUnit = relUnit + '/s';
      } else if (unit === 'bps') {
        relUnit = relUnit + '/s';
      }
    }
    return {
      'unit': relUnit,
      'value': relValue
    }

  }
}
