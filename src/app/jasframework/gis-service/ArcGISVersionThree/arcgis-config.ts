export const gisOption = {
  services: {
    // geometryServiceURL: "http://192.168.100.50:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
    //设置了代理，
    geometryServiceURL: "business/arcgis/rest/services/Utilities/Geometry/GeometryServer",
  },
  "map": {
    //使用哪个底图作为地图，baseMapLayers[0]
    useWhereBaseMap: 0,
    basemaps: {
      thumbnail: "../app02/images/map_yx.png",
      label: "基础底图",
      baseMapLayers: [
        {
          extent: {
            "xmax": 122.536931,                     // 范围内 右上角 X坐标
            "xmin": 107.046640,                     // 范围内 左下角 X坐标
            "ymax": 31.568955,                      // 范围内 右上角 Y坐标
            "ymin": 23.942782,                      // 范围内 左下角 Y坐标
            "spatialReference": { "wkid": 4490 }    // 几何的空间参考。https://developers.arcgis.com/javascript/3/jshelp/gcs.htm
          },
          baseMap: {
            info: {
              id: "china_shp",
              index: 0,
              label: "行政区划图",
              type: "tile",
              visible: true,
              attributes: { baseLayer: true },
              spatialReference: null,
            },
            url: "http://192.168.100.51:6080/arcgis/rest/services/%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%88%92/MapServer",
          },
        },
        {
          extent: {
            "xmax": 13596744.312379539,                     // 范围内 右上角 X坐标
            "xmin": 12004408.139143169,                     // 范围内 左下角 X坐标
            "ymax": 3589963.078238937,                      // 范围内 右上角 Y坐标
            "ymin": 2806024.916146378,                      // 范围内 左下角 Y坐标
            "spatialReference": { "wkid": 3857 }    // 几何的空间参考。https://developers.arcgis.com/javascript/3/jshelp/gcs.htm
          },
          baseMap: {
            info: {
              id: "world_shp",
              index: 0,
              label: "天地图彩色",
              type: "tile",
              visible: true,
              attributes: { baseLayer: true },
              spatialReference: null,
            },
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          },
        },
      ],
    },
    //业务图层
    optionLayers: [
      {
        id: "石油线路竞标",
        visible: true,
        outFields: ["*"],
        showLabels: true,
        // URL = "http://192.168.100.50:6080/arcgis/rest/services/testing/pd_features/MapServer/1"
        url: "business/arcgis/rest/services/testing/pd_features/MapServer/1",   //已经在webpack中配置代理了。
      },
    ],
  },

  // arcgis JS API 3.18版本地址，设置代理可直接在这里填写
  arcgisJS_API_url: 'arcgisAPI/arcgis_js_api/library/3.18/init.js',
}
