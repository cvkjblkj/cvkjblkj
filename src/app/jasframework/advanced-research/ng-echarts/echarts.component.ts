import { Component } from '@angular/core';
import { areaStackData, pieNestData, iphoneMap, optionMap, moreAreaStackData } from './data.ts';
import './china.js';
// 参考文档
// http://echarts.baidu.com/api.html#echarts
// https://github.com/AngularClass/angular2-webpack-starter
// https://segmentfault.com/a/1190000008175788
@Component({
  selector: 'charts-Ngecharts',
  templateUrl: "./echarts.component.html"
})
export class ngecharts {
  areaStackData: any[];
  pieNestData: any[];
  iphoneMap: any;
  optionMap: any;
  data: any;

  constructor() {
    Object.assign(this, { areaStackData, pieNestData, iphoneMap, optionMap, moreAreaStackData });

    let dateRang = this.dataScope('2017-05-01', '2017-06-30');
    this.data = moreAreaStackData;
    this.data.xAxis[0]['data'] = dateRang;

  }

  haha(event) {
    console.log('我点击了一个省:');
    console.log(event);
  }
  /*************************
* 计算两个日期时间段内所有日期
*
* @param value1
*            开始日期 YYYY-MM-DD
* @param value2
*            结束日期
* @return 日期数组
*/

  dataScope(value1, value2) {
    var getDate = function (str) {
      var tempDate = new Date();
      var list = str.split("-");
      tempDate.setFullYear(list[0]);
      tempDate.setMonth(list[1] - 1);
      tempDate.setDate(list[2]);
      return tempDate;
    }
    var date1 = getDate(value1);
    var date2 = getDate(value2);
    if (date1 > date2) {
      var tempDate = date1;
      date1 = date2;
      date2 = tempDate;
    }
    date1.setDate(date1.getDate() + 1);
    var dateArr = [];
    var i = 0;
    while (!(date1.getFullYear() == date2.getFullYear()
      && date1.getMonth() == date2.getMonth() && date1.getDate() == date2
        .getDate())) {
      var dayStr = date1.getDate().toString();
      var dateMonth = date1.getMonth() + 1;
      if (dayStr.length == 1) {
        dayStr = "0" + dayStr;
      } if (dateMonth.toString().length == 1) {
        var dateMonthStr = '0' + dateMonth;
      }
      dateArr[i] = date1.getFullYear() + "-" + dateMonthStr + "-"
        + dayStr;
      i++;
      date1.setDate(date1.getDate() + 1);
    }
    return dateArr;
  }
}
