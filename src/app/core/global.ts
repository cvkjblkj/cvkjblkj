import { RequestOptions, Headers, } from '@angular/http';

export const INCONFIG = {
  userInfo: {},
  appCode: 'PaasCloud',
  appId: '871e16bc-6e21-47fc-b358-47b9494179ff',
  viewTypeCode: 'WebManage',
  viewTypeId: '',
  validateType: 'mobile',
  enterpriseId: "5acd6a55-7174-4072-9073-0b5a238f9d6a",  // 平台中的jas企业的企业id
  // 定义微服务名字
  fileServerSrc: '/cloudlink/v1/cloudlink-core-file',
  dataServerSrc: '/cloudlink/v1/cloudlink-core-framework',
  zipkinServerSrc: '/cloudlink/zipkin/api/v1',
  journalServerSrc: '/cloudlink/v1/cloudlink-core-log',
  monitorServerSrc: '/cloudlink/v1/cloudlink-core-log',
  IOTServerSrc: '/cloudlink/v1/cloudlink-core-iot',
  // echat图表线条显示的颜色
  echartLineColor: ['#7CB5ED', '#F7A35C', '#2A918F', '#F15C81', '#E5D354', '#91ED7C', '#8185E9'],
  zn: {
    firstDayOfWeek: 0,
    dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  },
  // token: window.localStorage["jasToken"],
  JsonHeader: new Headers({ 'Content-Type': 'application/json' }),
  options: new RequestOptions({ headers: this.JsonHeader }),

  /**
   * 存储值到本地
   * @param key 存储值的名字
   * @param value 存储值
   */
  set(key: string, value: string) {
    window.localStorage.setItem(key, value)
  },
  /**
   * 获取本地存储的值
   * @param key 获取值
   */
  get(key: string) {
    return window.localStorage.getItem(key)
  },
  /**
   * 获取token值
   * @return token值
   */
  getToken() {
    return window.localStorage['jasToken']
  },


  /**
   * 设置 监控的 采样频率
   *
   *
   * @param {any} startTime  开始时间(毫秒)
   * @param {any} endTime  结束时间(毫秒)
   * @returns {"statisticsInterval": frequency,"statisticsType": statisticsType}
   */
  setSamplingFrequency(startTime, endTime, monitorName?: string) {

    let frequency = Math.ceil((endTime - startTime) / (200 * 1000 * 60));
    let statisticsType = "minute";
    if (monitorName == 'RDS') {
      if (frequency % 5 == 0) {
        frequency = frequency;
      } else if (frequency / 5 < 1) {
        frequency = 5;
      } else if (frequency / 5 > 1) {
        frequency = Math.ceil(frequency / 5) * 5;
      }
    }
    return {
      statisticsInterval: frequency,
      statisticsType: statisticsType
    }
  },
  /**
   * 监控连线的颜色
   */
  setColorStatus() {
    let buleColor = {
      lineStyle: {
        normal: {
          color: '#7CB5ED',  //连线颜色
          width: '1',
        }
      },
      itemStyle: {
        normal: {
          color: '#7CB5ED', //图标颜色
          width: '1',
        }
      },

    };
    let orangeColor = {
      lineStyle: {
        normal: {
          color: '#F7A35C',  //连线颜色
          width: '1',
        }
      },
      itemStyle: {
        normal: {
          color: '#F7A35C' //图标颜色
        }
      },

    };
    let greenColor = {
      lineStyle: {
        normal: {
          color: '#2A918F',  //连线颜色
          width: '1',
        }
      },
      itemStyle: {
        normal: {
          color: '#2A918F' //图标颜色
        }
      },

    };
    let pinkColor = {
      lineStyle: {
        normal: {
          color: '#F15C81',  //连线颜色
          width: '1',
        }
      },
      itemStyle: {
        normal: {
          color: '#F15C81' //图标颜色
        }
      },

    };
    let yellowColor = {
      lineStyle: {
        normal: {
          color: '#E5D354',  //连线颜色
          width: '1',
        }
      },
      itemStyle: {
        normal: {
          color: '#E5D354' //图标颜色
        }
      },

    };
    let lightGreenColor = {
      lineStyle: {
        normal: {
          color: '#91ED7C',  //连线颜色
          width: '1',
        }
      },
      itemStyle: {
        normal: {
          color: '#91ED7C' //图标颜色
        }
      },

    };
    let lavenderColor = {
      lineStyle: {
        normal: {
          color: '#8185E9',  //连线颜色
          width: '1',
        }
      },
      itemStyle: {
        normal: {
          color: '#8185E9' //图标颜色
        }
      },

    };
    return {
      buleColor,
      orangeColor,
      greenColor,
      pinkColor,
      yellowColor,
      lightGreenColor,
      lavenderColor
    }
  }
}
