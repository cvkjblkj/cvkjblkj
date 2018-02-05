
// 登录日志 筛选条件数据
export const loginFilterData = [
  { label: '用户姓名', value: { name: 'userName' } },
  { label: '手机号', value: { name: 'mobileNum' } },
  { label: '企业名称', value: { name: 'enterpriseName' } },
  { label: '企业认证状态', value: { name: 'enterpriseAuthStatus' } },
  { label: '应用名称', value: { name: 'appName' } },
  { label: '应用版本', value: { name: 'appVersion' } },
  { label: '登录省份', value: { name: 'province' } },
  { label: '登录城市', value: { name: 'city' } },
  { label: '客户端类型', value: { name: 'clientType' } },
  { label: '操作系统', value: { name: 'os' } },
  // { label: '操作系统版本', value: { name: 'osVersion' } },
  { label: '浏览器品牌', value: { name: 'browserBrand' } },
  { label: '浏览器版本', value: { name: 'browserVersion' } },
  { label: '设备型号', value: { name: 'deviceType' } },
  // { label: '屏幕高度', value: { name: 'screenHeight' } },
  // { label: '屏幕宽度', value: { name: 'screenWidth' } },
  { label: '网络环境', value: { name: 'network' } },
  { label: '运营商', value: { name: 'carrieroperator' } }
];
// 登录日志 列表项
export const listData = [
  { 'field': 'userName', 'header': '用户姓名', 'checked': true },
  { 'field': 'mobileNum', 'header': '手机号', 'checked': true },
  { 'field': 'userId', 'header': '用户ID', 'checked': false },
  { 'field': 'enterpriseName', 'header': '企业名称', 'checked': true },
  { 'field': 'enterpriseAuthStatus', 'header': '企业认证状态', 'checked': false },
  { 'field': 'enterpriseId', 'header': '企业ID', 'checked': false },
  { 'field': 'appName', 'header': '应用名称', 'checked': true },
  { 'field': 'appVersion', 'header': '应用版本', 'checked': false },
  { 'field': 'appId', 'header': '应用ID', 'checked': false },
  { 'field': 'loginTime', 'header': '登录时间', 'checked': true },
  // { 'field': 'quitTime', 'header': '退出时间', 'checked': false },
  // { 'field': 'duration', 'header': '登录时长', 'checked': false },
  { 'field': 'userIp', 'header': '用户IP', 'checked': false },
  { 'field': 'country', 'header': '登录国家', 'checked': false },
  { 'field': 'province', 'header': '登录省份', 'checked': false },
  { 'field': 'city', 'header': '登录城市', 'checked': true },
  { 'field': 'clientType', 'header': '客户端类型', 'checked': true },
  { 'field': 'os', 'header': '操作系统', 'checked': true },
  // { 'field': 'osVersion', 'header': '操作系统版本', 'checked': false },
  { 'field': 'browserBrand', 'header': '浏览器品牌', 'checked': false },
  { 'field': 'browserVersion', 'header': '浏览器版本', 'checked': false },
  { 'field': 'deviceType', 'header': '设备型号', 'checked': false },
  { 'field': 'screenHeight', 'header': '屏幕高度', 'checked': false },
  { 'field': 'screenWidth', 'header': '屏幕宽度', 'checked': false },
  { 'field': 'network', 'header': '网络环境', 'checked': false },
  { 'field': 'carrieroperator', 'header': '运营商', 'checked': false },

  { 'field': 'serviceName', 'header': '微服务名称', 'checked': false },
  { 'field': 'serviceIp', 'header': '服务端IP', 'checked': false },
  { 'field': 'servicePort', 'header': '服务端端口', 'checked': false },
  { 'field': 'requestURI', 'header': '请求URI', 'checked': false },
  { 'field': 'sourceURL', 'header': '来源URL', 'checked': false },
  // { 'field': 'sourceDomain', 'header': '来源域名', 'checked': false },
  // { 'field': 'collectionPoint', 'header': '采集点', 'checked': false }
]
// 客户端类型
export const clientTypeData = [
  // { label: 'all', value: 'all' },
  { label: 'COMPUTER', value: 'COMPUTER' },
  { label: 'MOBILE', value: 'MOBILE' },
  { label: 'TABLET', value: 'TABLET' },
]
// 操作系统
export const osData = [
  // { label: 'all', value: 'all' },
  { label: 'Android', value: 'Android' },
  { label: 'Windows', value: 'Windows' },
  { label: 'Mac OS', value: 'Mac OS' },
  // { label: 'MAC_OS_X', value: 'MAC_OS_X' },
]

// 认证状态数据
export const enpAuthStatusData = [
  { label: '待审核', value: 2 },
  { label: '未认证', value: 0 },
  { label: '认证通过', value: 1 },
  { label: '认证驳回', value: -1 },
]

// 业务日志 筛选条件数据
export const businessFilterData = [
  { label: '用户姓名', value: { name: 'userName' } },
  { label: '企业名称', value: { name: 'enterpriseName' } },
  { label: '应用名称', value: { name: 'appName' } },
  { label: '应用版本', value: { name: 'appVersion' } },
  { label: '功能名称', value: { name: 'functionName' } },
  { label: '变更类型', value: { name: 'modifyType' } },
  { label: '变更详情', value: { name: 'detail' } },
];
export const businesChangeTypeData = [
  { label: 'ADD', value: 'ADD' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'UPDATE', value: 'UPDATE' },
]


// 系统日志 筛选条件数据

// 微服务 筛选数据
export const microServiceFilterData = [
  { label: '服务名称', value: { name: 'serviceName' } },
  // { label: 'API', value: { name: 'api' } },
  { label: '日志级别', value: { name: 'logLevel' } },
  { label: '异常编码', value: { name: 'errorCode' } },
  { label: '应用名称', value: { name: 'appName' } },
  { label: '应用版本', value: { name: 'appVersion' } },
  // { label: '功能名称', value: { name: 'funName' } },
  { label: '用户姓名', value: { name: 'userName' } }

];
//nginx
export const nginxServiceFilterData = [
  { label: '容器名称', value: { name: 'container_name' } },
  { label: '应用名称', value: { name: 'appCode' } },
  { label: '状态码', value: { name: 'code' } },


];
// 日志级别 数据
export const loginRankData = [
  { label: 'ERROR', value: 'ERROR' },
  { label: 'WARN', value: 'WARN' },
  { label: 'INFO', value: 'INFO' },
];
//主机筛选数据
export const masterServiceFilterData = [
  { label: '主机名称', value: { name: 'host' } },
  { label: '服务名称', value: { name: 'ident' } },
  { label: '日志信息', value: { name: 'message' } },
];
//主机筛选 日志级别数据
export const masterRankData = [
  { label: 'EMERG', value: 'emerg' },
  { label: 'ALERT', value: 'alert' },
  { label: 'CRIT', value: 'crit' },
  { label: 'ERROR', value: 'error' },
  { label: 'WARN', value: 'warn' },
  { label: 'NOTICE', value: 'notice' },
  { label: 'INFO', value: 'info' },
  { label: 'DEBUG', value: 'debug' },
]
//docker主机筛选数据
export const dockerServiceFileData = [
  { label: '主机名称', value: { name: 'host' } },
  { label: '服务名称', value: { name: 'ident' } },
  { label: '日志信息', value: { name: 'message' } },
]
//docker 日志级别数据
export const dockerRankData = [
  { label: 'EMERG', value: 'emerg' },
  { label: 'ALERT', value: 'alert' },
  { label: 'CRIT', value: 'crit' },
  { label: 'ERROR', value: 'error' },
  { label: 'WARN', value: 'warn' },
  { label: 'NOTICE', value: 'notice' },
  { label: 'INFO', value: 'info' },
  { label: 'DEBUG', value: 'debug' },
]
export const masterData = [
  { label: 'ERROR', value: 'ERROR' },
  { label: 'WARN', value: 'WARN' },
  { label: 'INFO', value: 'INFO' },
];
//Tomcat 日志级别
export const tomcatData = [
  { label: '容器名称', value: { name: 'container_name' } },
  { label: '应用名称', value: { name: 'appCode' } },
  { label: '日志级别', value: { name: 'level' } },
  { label: '日志信息', value: { name: 'log' } },

];
export const tomcatRankData = [
  { label: 'EMERG', value: 'emerg' },
  { label: 'ALERT', value: 'alert' },
  { label: 'CRIT', value: 'crit' },
  { label: 'ERROR', value: 'error' },
  { label: 'WARN', value: 'warn' },
  { label: 'NOTICE', value: 'notice' },
  { label: 'INFO', value: 'info' },
  { label: 'DEBUG', value: 'debug' },
]
// 地图坐标数据
export const geoCoordMap = {
  '海门': [121.15, 31.89],
  '鄂尔多斯': [109.781327, 39.608266],
  '招远': [120.38, 37.35],
  '舟山': [122.207216, 29.985295],
  '齐齐哈尔': [123.97, 47.33],
  '盐城': [120.13, 33.38],
  '赤峰': [118.87, 42.28],
  '青岛': [120.33, 36.07],
  '乳山': [121.52, 36.89],
  '金昌': [102.188043, 38.520089],
  '泉州': [118.58, 24.93],
  '莱西': [120.53, 36.86],
  '日照': [119.46, 35.42],
  '胶南': [119.97, 35.88],
  '南通': [121.05, 32.08],
  '拉萨': [91.11, 29.97],
  '云浮': [112.02, 22.93],
  '梅州': [116.1, 24.55],
  '文登': [122.05, 37.2],
  '上海': [121.48, 31.22],
  '攀枝花': [101.718637, 26.582347],
  '威海': [122.1, 37.5],
  '承德': [117.93, 40.97],
  '厦门': [118.1, 24.46],
  '汕尾': [115.375279, 22.786211],
  '潮州': [116.63, 23.68],
  '丹东': [124.37, 40.13],
  '太仓': [121.1, 31.45],
  '曲靖': [103.79, 25.51],
  '烟台': [121.39, 37.52],
  '福州': [119.3, 26.08],
  '瓦房店': [121.979603, 39.627114],
  '即墨': [120.45, 36.38],
  '抚顺': [123.97, 41.97],
  '玉溪': [102.52, 24.35],
  '张家口': [114.87, 40.82],
  '阳泉': [113.57, 37.85],
  '莱州': [119.942327, 37.177017],
  '湖州': [120.1, 30.86],
  '汕头': [116.69, 23.39],
  '昆山': [120.95, 31.39],
  '宁波': [121.56, 29.86],
  '湛江': [110.359377, 21.270708],
  '揭阳': [116.35, 23.55],
  '荣成': [122.41, 37.16],
  '连云港': [119.16, 34.59],
  '葫芦岛': [120.836932, 40.711052],
  '常熟': [120.74, 31.64],
  '东莞': [113.75, 23.04],
  '河源': [114.68, 23.73],
  '淮安': [119.15, 33.5],
  '泰州': [119.9, 32.49],
  '南宁': [108.33, 22.84],
  '营口': [122.18, 40.65],
  '惠州': [114.4, 23.09],
  '江阴': [120.26, 31.91],
  '蓬莱': [120.75, 37.8],
  '韶关': [113.62, 24.84],
  '嘉峪关': [98.289152, 39.77313],
  '广州': [113.23, 23.16],
  '延安': [109.47, 36.6],
  '太原': [112.53, 37.87],
  '清远': [113.01, 23.7],
  '中山': [113.38, 22.52],
  '昆明': [102.73, 25.04],
  '寿光': [118.73, 36.86],
  '盘锦': [122.070714, 41.119997],
  '长治': [113.08, 36.18],
  '深圳': [114.07, 22.62],
  '珠海': [113.52, 22.3],
  '宿迁': [118.3, 33.96],
  '咸阳': [108.72, 34.36],
  '铜川': [109.11, 35.09],
  '平度': [119.97, 36.77],
  '佛山': [113.11, 23.05],
  '海口': [110.35, 20.02],
  '江门': [113.06, 22.61],
  '章丘': [117.53, 36.72],
  '肇庆': [112.44, 23.05],
  '大连': [121.62, 38.92],
  '临汾': [111.5, 36.08],
  '吴江': [120.63, 31.16],
  '石嘴山': [106.39, 39.04],
  '沈阳': [123.38, 41.8],
  '苏州': [120.62, 31.32],
  '茂名': [110.88, 21.68],
  '嘉兴': [120.76, 30.77],
  '长春': [125.35, 43.88],
  '胶州': [120.03336, 36.264622],
  '银川': [106.27, 38.47],
  '张家港': [120.555821, 31.875428],
  '三门峡': [111.19, 34.76],
  '锦州': [121.15, 41.13],
  '南昌': [115.89, 28.68],
  '柳州': [109.4, 24.33],
  '三亚': [109.511909, 18.252847],
  '自贡': [104.778442, 29.33903],
  '吉林': [126.57, 43.87],
  '阳江': [111.95, 21.85],
  '泸州': [105.39, 28.91],
  '西宁': [101.74, 36.56],
  '宜宾': [104.56, 29.77],
  '呼和浩特': [111.65, 40.82],
  '成都': [104.06, 30.67],
  '大同': [113.3, 40.12],
  '镇江': [119.44, 32.2],
  '桂林': [110.28, 25.29],
  '张家界': [110.479191, 29.117096],
  '宜兴': [119.82, 31.36],
  '北海': [109.12, 21.49],
  '西安': [108.95, 34.27],
  '金坛': [119.56, 31.74],
  '东营': [118.49, 37.46],
  '牡丹江': [129.58, 44.6],
  '遵义': [106.9, 27.7],
  '绍兴': [120.58, 30.01],
  '扬州': [119.42, 32.39],
  '常州': [119.95, 31.79],
  '潍坊': [119.1, 36.62],
  '重庆': [106.54, 29.59],
  '台州': [121.420757, 28.656386],
  '南京': [118.78, 32.04],
  '滨州': [118.03, 37.36],
  '贵阳': [106.71, 26.57],
  '无锡': [120.29, 31.59],
  '本溪': [123.73, 41.3],
  '克拉玛依': [84.77, 45.59],
  '渭南': [109.5, 34.52],
  '马鞍山': [118.48, 31.56],
  '宝鸡': [107.15, 34.38],
  '焦作': [113.21, 35.24],
  '句容': [119.16, 31.95],
  '北京': [116.46, 39.92],
  '徐州': [117.2, 34.26],
  '衡水': [115.72, 37.72],
  '包头': [110, 40.58],
  '绵阳': [104.73, 31.48],
  '乌鲁木齐': [87.68, 43.77],
  '枣庄': [117.57, 34.86],
  '杭州': [120.19, 30.26],
  '淄博': [118.05, 36.78],
  '鞍山': [122.85, 41.12],
  '溧阳': [119.48, 31.43],
  '库尔勒': [86.06, 41.68],
  '安阳': [114.35, 36.1],
  '开封': [114.35, 34.79],
  '济南': [117, 36.65],
  '德阳': [104.37, 31.13],
  '温州': [120.65, 28.01],
  '九江': [115.97, 29.71],
  '邯郸': [114.47, 36.6],
  '临安': [119.72, 30.23],
  '兰州': [103.73, 36.03],
  '沧州': [116.83, 38.33],
  '临沂': [118.35, 35.05],
  '南充': [106.110698, 30.837793],
  '天津': [117.2, 39.13],
  '富阳': [119.95, 30.07],
  '泰安': [117.13, 36.18],
  '诸暨': [120.23, 29.71],
  '郑州': [113.65, 34.76],
  '哈尔滨': [126.63, 45.75],
  '聊城': [115.97, 36.45],
  '芜湖': [118.38, 31.33],
  '唐山': [118.02, 39.63],
  '平顶山': [113.29, 33.75],
  '邢台': [114.48, 37.05],
  '德州': [116.29, 37.45],
  '济宁': [116.59, 35.38],
  '荆州': [112.239741, 30.335165],
  '宜昌': [111.3, 30.7],
  '义乌': [120.06, 29.32],
  '丽水': [119.92, 28.45],
  '洛阳': [112.44, 34.7],
  '秦皇岛': [119.57, 39.95],
  '株洲': [113.16, 27.83],
  '石家庄': [114.48, 38.03],
  '莱芜': [117.67, 36.19],
  '常德': [111.69, 29.05],
  '保定': [115.48, 38.85],
  '湘潭': [112.91, 27.87],
  '金华': [119.64, 29.12],
  '岳阳': [113.09, 29.37],
  '长沙': [113, 28.21],
  '衢州': [118.88, 28.97],
  '廊坊': [116.7, 39.53],
  '菏泽': [115.480656, 35.23375],
  '合肥': [117.27, 31.86],
  '武汉': [114.31, 30.52],
  '大庆': [125.03, 46.58]
};
// 处理散点数据
export const convertData = function (data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      });
    }
  }
  return res;
};

// 数据 echarts和百度地图结合
let loginAreaMap = {
  title: {
    text: '登录区域分布统计',
    left: 'left',
    textStyle: {
      color: '#333',
      fontSize: 12,
    },
  },
  tooltip: {
    trigger: 'item'
  },
  bmap: {
    center: [104.114129, 37.550339],
    zoom: 5,
    roam: true,
    mapStyle: {
      styleJson: [{
        'featureType': 'water',
        'elementType': 'all',
        'stylers': {
          'color': '#d1d1d1'
        }
      }, {
        'featureType': 'land',
        'elementType': 'all',
        'stylers': {
          'color': '#f3f3f3'
        }
      }, {
        'featureType': 'railway',
        'elementType': 'all',
        'stylers': {
          'visibility': 'off'
        }
      }, {
        'featureType': 'highway',
        'elementType': 'all',
        'stylers': {
          'color': '#fdfdfd'
        }
      }, {
        'featureType': 'highway',
        'elementType': 'labels',
        'stylers': {
          'visibility': 'off'
        }
      }, {
        'featureType': 'arterial',
        'elementType': 'geometry',
        'stylers': {
          'color': '#fefefe'
        }
      }, {
        'featureType': 'arterial',
        'elementType': 'geometry.fill',
        'stylers': {
          'color': '#fefefe'
        }
      }, {
        'featureType': 'poi',
        'elementType': 'all',
        'stylers': {
          'visibility': 'off'
        }
      }, {
        'featureType': 'green',
        'elementType': 'all',
        'stylers': {
          'visibility': 'off'
        }
      }, {
        'featureType': 'subway',
        'elementType': 'all',
        'stylers': {
          'visibility': 'off'
        }
      }, {
        'featureType': 'manmade',
        'elementType': 'all',
        'stylers': {
          'color': '#d1d1d1'
        }
      }, {
        'featureType': 'local',
        'elementType': 'all',
        'stylers': {
          'color': '#d1d1d1'
        }
      }, {
        'featureType': 'arterial',
        'elementType': 'labels',
        'stylers': {
          'visibility': 'off'
        }
      }, {
        'featureType': 'boundary',
        'elementType': 'all',
        'stylers': {
          'color': '#fefefe'
        }
      }, {
        'featureType': 'building',
        'elementType': 'all',
        'stylers': {
          'color': '#d1d1d1'
        }
      }, {
        'featureType': 'label',
        'elementType': 'labels.text.fill',
        'stylers': {
          'color': '#999999'
        }
      }]
    }
  },
  series: [
    {
      name: '',
      type: 'scatter',
      mapType: 'map',
      coordinateSystem: 'bmap',
      data: [
        // {name:'上海',value:[122.05, 37.2,90]}
      ],
      symbolSize: function (val) {
        return val[2];
      },
      label: {
        normal: {
          formatter: '{b}',
          position: 'right',
          show: false
        },
        emphasis: {
          show: true
        }
      },
      itemStyle: {
        normal: {
          color: '#00AA7A'
        }
      }
    },
    {
      name: 'Top 5',
      type: 'effectScatter',
      coordinateSystem: 'bmap',
      data: [],
      symbolSize: function (val) {
        return val[2];
      },
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke'
      },
      hoverAnimation: true,
      label: {
        normal: {
          formatter: '{b}',
          position: 'right',
          show: true
        }
      },
      itemStyle: {
        normal: {
          color: '#00AA7A',
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      zlevel: 1
    }
  ]
};

export const areaMapData = {
  title: {
    text: '登录区域分布统计',
    left: 'right',
    textStyle: {
      color: '#333',
      fontSize: 12,
    },
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: []
  },
  visualMap: {
    min: 0,
    max: 2500,
    left: 'left',
    top: 'bottom',
    text: ['高', '低'], // 文本，默认为数值文本
    calculable: true
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },
  series: []
};
