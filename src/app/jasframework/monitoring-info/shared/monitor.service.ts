import { CommonService } from './../../../core/common-service/common.service';
import { Http, Response } from '@angular/http';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { Observable } from 'rxjs/Observable';
import { INCONFIG } from './../../../core/global';
import { Injectable } from '@angular/core';
@Injectable()
export class MonitorService {
  public serviceName = INCONFIG.monitorServerSrc;
  public appListData: any;
  public button: any;// 下载按钮的值的集合
  constructor(
    public commonRequestMethodService: CommonRequestMethodService,
    public http: Http,
    public commonService: CommonService
  ) { }

  /**
   * 日志搜索过滤
   * @param url 请求地址
   * @param value 请求参数
   */
  public searchData(__this: any, url: any, value: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.serviceName + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler, errorhandler)
  }
  /**
   * 日志下载
   * @param url 请求路径
   * @param value 请求参数
   */


  /**
   * 获取主机监控的数据
   *
   * @param {any} __this this指向
   * @param {any} data 请求参数
   * @param {any} successHandler 成功处理函数
   * @memberof MonitorService
   */
  getECSData(__this, data, successHandler) {
    let url = this.serviceName + '/monitor/ecs/v2/statistics';
    this.commonRequestMethodService.doPost(__this, url, data, successHandler)
  }

  /**
   * 获取ECS设备名称
   * @param {any} __this this指向
   * @param {any} data 请求参数
   * @param {any} successHandler 成功处理函数
   * */
  getECSDeviceName(__this, data, successHandler) {
    let url = this.serviceName + '/monitor/ecs/v2/getValues';
    this.commonRequestMethodService.doPost(__this, url, data, successHandler)
  }


  /**
   * 将数据归类
   *
   * @param {Array<any>} souceArr 后台返回的数据
   * @param {Array<any>} customData 自定义表
   * @returns {  BPS:{title:,data:[],legend:[]} }
   * @memberof MonitorService
   */
  classifyMonitorData(souceArr: Array<any>, customData: Array<any>) {
    let classifyData = {};  // 接收 归类好的数据
    let data = [];  // 接收
    for (let m = 0; m < souceArr.length; m++) {
      // 后台返回的数据
      let sourceItem = souceArr[m];

      for (let i = 0; i < customData.length; i++) {
        // 自定义 的表数据，记录描述和单位
        let customItem = customData[i];
        // console.log('自定义表');
        // console.log(customItem);
        if (sourceItem.metric == customItem.Metric) {
          sourceItem.describe = customItem.describe;
        }

        // 换算值
        // var conversion = customItem['conversion'] ? customItem['conversion'] : 1;
        // conversion = customItem.unit == 'bit/s' ? conversion * 1024 : conversion;
        // console.log(customItem.Metric + "==========customItem.Metric");
        // console.log(sourceItem.metric + "==========sourceItem.metric");
        // 判断返回数据的metric的值 ,判断是基础监控还是操作系统的
        if (customItem.Metric == sourceItem.metric) {
          // 改变数据值
          // sourceItem.maximum = (sourceItem.maximum / conversion).toFixed(2);
          // sourceItem.minimum = (sourceItem.minimum / conversion).toFixed(2);
          // sourceItem.average = (sourceItem.average / conversion).toFixed(2);
          let resultValue = this.unitConversion(customItem['unit'], sourceItem['maximum']);
          sourceItem.maximum = resultValue.value;
          sourceItem.unit = resultValue.unit;
          sourceItem.minimum = this.unitConversion(customItem['unit'], sourceItem['minimum']).value;
          sourceItem.average = this.unitConversion(customItem['unit'], sourceItem['average']).value;

          // 判断图表中有几条折线
          // identifier 的长度等于 sourceItem.metric的长度 且
          if (sourceItem.metric.indexOf(customItem['identifier']) != -1) {

            if (customItem['identifier'].length == sourceItem.metric.length) {
              // 图表里面只有一条折线
              if (!classifyData[sourceItem.metric]) {
                // classifyData里面 不存在 key了
                classifyData[sourceItem.metric] = {
                  title: sourceItem.unit ? customItem.describe + '(' + sourceItem.unit + ')' : customItem.describe,
                  data: [sourceItem],
                  legend: /[\u4e00-\u9fa5]+/.test(customItem.describe) ? [customItem.describe] : [customItem.Metric],
                  metric: [sourceItem.metric],
                  unit: sourceItem.unit
                }
              } else {
                // 如果classifyData里面已经存在 key了
                classifyData[sourceItem.metric].data.push(sourceItem);
              }

            } else {
              // 图表里面多条折线
              // legend值
              let legendValue = /[\u4e00-\u9fa5]+/.test(customItem.describe) ? customItem.describe : customItem.Metric;
              if (classifyData[customItem['title']]) {
                // 如果classifyData里面已经存在 key了
                classifyData[customItem['title']].data.push(sourceItem);
                // classifyData[customItem['title']].metric.push(sourceItem.metric);

                // 判断legend是否存在重复的值
                let legend = {};
                for (let item of classifyData[customItem['title']].legend) {
                  legend[item] = 1;
                }
                if (!legend[legendValue]) {
                  classifyData[customItem['title']].legend.push(legendValue);
                }
                // 判断metric是否存在重复的值
                let metricObj = {};
                for (let item of classifyData[customItem['title']].metric) {
                  metricObj[item] = 1;
                }
                if (!metricObj[sourceItem.metric]) {
                  classifyData[customItem['title']].metric.push(sourceItem.metric);
                }

              } else {
                classifyData[customItem['title']] = {
                  title: sourceItem.unit ? customItem['title'] + '(' + sourceItem.unit + ')' : customItem['title'],
                  data: [sourceItem],
                  legend: [legendValue],
                  metric: [sourceItem.metric],
                  unit: sourceItem.unit
                }
              }
            }
          }

        }
      }
    }
    return classifyData;
  }


  /**
   * 修改 归类后的echarts数据
   *
   * @param {*} classifyData 归类后的echarts数据
   * @returns
   * @memberof BaseMonitorComponent
   */
  changeClassifyMonitorData(classifyData: any) {
    let serieObj;   // 单个的series 的数据
    let changeListData = [];   //  接收  改变后的归类数据
    let moreLine = {};  // 多条线 接收  改变后series的 data;
    // classifyData  是一个对象
    for (let key in classifyData) {
      let itemValue = classifyData[key];
      let newDataList = {
        title: itemValue['title'],
        legend: itemValue['legend'],
        metric: itemValue['metric'],
        series: {
          'average': [],
          'minimum': [],
          'maximum': []
        },
        xAxisData: [],
        unit: itemValue['unit'] ? itemValue['unit'] : '',
      };
      let dataShow = {
        'average': [],
        'minimum': [],
        'maximum': []
      }
      for (let i = 0; i < itemValue.data.length; i++) {
        let item = itemValue.data[i];
        let timeStamp = item.timestamp.slice(item.timestamp.indexOf(' ') + 1, item.timestamp.length);
        // 只有一条线
        if (itemValue['legend'].length == 1) {

          // X轴数据
          newDataList.xAxisData.push(timeStamp);
          // series 数据
          for (var seriesKey in newDataList.series) {
            // serieObj.name = itemValue['legend'][0];
            // serieObj.data.push(item[seriesKey]);
            // newDataList.series[seriesKey] = serieObj;
            dataShow[seriesKey].push(item[seriesKey])
            newDataList.series[seriesKey] = { name: itemValue['legend'][0], type: 'line', data: dataShow[seriesKey] };
          }

        } else {
          // 多条线

          // 处理后的列表
          // newDataList.xAxisData.push(timeStamp);
          let moreLineKey = /[\u4e00-\u9fa5]+/.test(item.describe) ? item.describe : item.metric;
          if (!moreLine[moreLineKey]) {
            // 对象中没有这个项
            moreLine[moreLineKey] = {
              xData: [timeStamp]
            };
            for (var seriesKey in newDataList.series) {

              moreLine[moreLineKey][seriesKey] = [item[seriesKey]];
            }
          } else {
            // 对象中已存在
            moreLine[moreLineKey].xData.push(timeStamp);
            for (var seriesKey in newDataList.series) {
              moreLine[moreLineKey][seriesKey].push(item[seriesKey]);
            }
          }
        }
      }
      if (itemValue['legend'].length > 1) {
        for (let item of itemValue['legend']) {
          for (var seriesKey in newDataList.series) {
            newDataList.series[seriesKey].push({
              name: item,
              type: 'line',
              data: moreLine[item][seriesKey],
            });
          }
          newDataList.xAxisData = moreLine[item].xData;
        }

      }

      changeListData.push(newDataList);
    }
    return changeListData
  }



  /**
   * 处理改变后的数据，判断是否有空的数据,并将数据排序
   *
   * @param {Object} rightOrder 正确的图表显示顺序
   * @param {Array<any>} echartsData 改变后的echarts数据
   * @returns 排序后的数据，
   * @memberof BaseMonitorComponent
   */
  detailEchartsOrder(rightOrder: Object, echartsData: Array<any>) {
    let rightEchartsOrder = [];
    for (var key in rightOrder) {
      for (let item of echartsData) {
        if (key === item.title) {
          rightEchartsOrder[rightOrder[key]] = item;
          delete rightOrder[key];
        }
      }
    }
    if (JSON.stringify(rightOrder) != '{}') {
      //   不是空对象
      for (var key in rightOrder) {
        rightEchartsOrder[rightOrder[key]] = {
          title: key,
          data: []
        };
      }
    }
    return rightEchartsOrder
  }

  /**
   * 单位换算
   *
   * @param {any} unit 单位
   * @param {any} dataArr 数组
   * @returns
   * @memberof MonitorService
   */
  public unitConversion(unit, dataArr) {
    let K = 1024;
    let M = 1048576;
    let G = 1073741824;
    let T = 1099511627776;
    let P = T * 1024;
    let E = P * 1024;
    let Z = E * 1024;
    let Y = Z * 1024;
    let capacityCon = {
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
    if (!unit || (unit.indexOf('bits') == -1 && unit.indexOf('bps') == -1 && unit.indexOf('bytes') == -1)) {
      // 没有单位 或者不需要转换单位
      relUnit = unit ? unit : '';
      for (let itemData of dataArr) {
        let numItem = [];
        for (let item of itemData.datas) {
          numItem.push(Number(item).toFixed(2))
        }
        itemData.datas = numItem;
      }

      return {
        'unit': relUnit,
        'value': dataArr
      }
    } else {
      if (unit.indexOf('bits') != -1) {
        // bit 为单位
        bit = 'b';
      } else if (unit.indexOf('bps') != -1) {
        // bit 为单位
        bit = 'b';
      } else if (unit.indexOf('bytes') != -1) {
        // bytes 为单位
        bit = 'B';
      } else {
        bit = 'B';
      }
      if (dataArr.length == 1) {
        // 只有一条数据，取平均值为准
        let average = this.commonService.arrAverageNum(dataArr[0].datas);
        // console.log(average);
        for (let key in capacityCon) {
          if (average / capacityCon[key] < 999 && average / capacityCon[key] > 0.1) {
            // console.log(relUnit);
            relUnit = key;
            break;
          } else if (average / capacityCon[key] < 0.1) {
            relUnit = unit;

            break;
          }
        }
      } else if (dataArr.length > 1) {
        // 有多条数据，取最小值为准
        // console.log(dataArr);
        let minArr = [];
        for (let item of dataArr) {
          //如果这条数据所有数据都是0，则忽略这个数据
          if (0 == this.commonService.arrCountNum(item.datas)) continue;
          let min = this.commonService.arrMinNum(item.datas);
          minArr.push(min);
        }
        let minValue = this.commonService.arrMinNum(minArr);

        for (let key in capacityCon) {
          // 单位的区间在 大于0.1 小于999
          if ((minValue / capacityCon[key] < 999 && minValue / capacityCon[key] > 0.1)) {
            relUnit = key;
            break;
          } else if (minValue / capacityCon[key] < 0.1) {
            relUnit = unit;
            break;
          } else if (minArr.length == 0 || minValue == Infinity) {
            //如果比较的数据都是0 或者最小值是Infinity， 则不转化单位
            relUnit = unit;
            break;
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
      // console.log(relValue);
      // console.log(relUnit);
      if (relUnit.indexOf('s') == -1) {
        relUnit = relUnit + bit;
        if (unit === 'bytes/s') {
          relUnit = relUnit + '/s';
        } else if (unit === 'bits/s') {
          relUnit = relUnit + '/s';
        } else if (unit === 'bps') {
          relUnit = relUnit + '/s';
        } else if (unit === 'bytes') {
          relUnit = relUnit;
        }
      }

      return {
        'unit': relUnit,
        'value': relValue
      }
    }


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
      // console.log(unit);
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

    // console.log(relValue);

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


  /**
   * 单位换算
   */
  public unitChanged(unit, dataArr) {
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

    if (unit.indexOf('bits') == -1 || unit.indexOf('bps') == -1 || unit.indexOf('bytes') == -1) {
      // bit 为单位
      bit = 'b';
    } else {
      // bytes 为单位
      bit = 'B';
    };

    if (dataArr.length == 1) {
      // 只有一条数据，取平均值为准

      for (let key in capacityCon) {
        if (dataArr[0].datas[0] / capacityCon[key] < 999) {
          relUnit = key;

          break;
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
  };
  /**
 * 单位换算
 *
 * @param {any} unit 单位
 * @param {any} dataArr 数组
 * @returns
 * @memberof MonitorService
 */
  public historyUnitConversion(unit, dataArr, dataArr2?: any) {
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
    let line1Data = [];
    let bit;  // 转换为 B 或者b

    if (unit.indexOf('bits') == -1 || unit.indexOf('bps') == -1 || unit.indexOf('bytes') == -1) {
      // bit 为单位
      bit = 'b';
    } else {
      // bytes 为单位
      bit = 'B';
    };

    if (dataArr.length == 1) {
      // 只有一条数据，取平均值为准

      let average = this.commonService.arrAverageNum(dataArr[0].datas);

      for (let key in capacityCon) {
        if (average / capacityCon[key] < 999) {
          // console.log(relUnit);

          relUnit = key;

          break;
        }
        //  else if (average / capacityCon[key] < 0.1) {
        //   relUnit = unit;

        //   break;
        // }
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
    };

    if (dataArr2) {
      for (var i = 0; i < dataArr2[0].length; i++) {
        if (!capacityCon[relUnit]) {
          capacityCon[relUnit] = 1;
        };
        line1Data.push((dataArr2[0][0] / capacityCon[relUnit]).toFixed(2));
      };

      relValue.push({ 'value2': line1Data });
    };
    return {
      'value': relValue
    }
  }

}















