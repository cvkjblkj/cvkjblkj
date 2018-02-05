import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// https://github.com/tomwayson/angular-esri-loader
import { EsriLoaderService } from 'angular2-esri-loader';
import { Headers, Http, Jsonp, Response } from "@angular/http";
import { CommonService } from './../../../core/common-service/common.service';
import { gisOption } from './arcgis-config';    //引入底图需要的参数，底图地址、图层地址、API地址等参数

@Component({
  selector: 'arcgis-version-three-map',
  templateUrl: 'arcgis-version-three-map.component.html',
  styleUrls: ['./arcgis-version-three-map.component.css'],
  providers: [CommonService]
})

export class ArcGisVersionThreeMapComponent implements OnInit {

  @ViewChild('arcGisMapDiv') mapView: ElementRef;

  private arcGisLoadFinish: boolean;    // arcgis API加载完毕标志, 如果API没有加载，其他的功能则不能执行，否则执行会出错。
  public arcGisMap: any;                // 地图
  public queryLayerPoint: any;          // 图层上的一个点，用于查询这个点的信息
  public queryLayerId: any;             // 要查询的图层ID
  public businessLayerConf: any;        // 业务图层配置项
  public navigate: any;                 // arcgis导航模块实例
  public myGeometryService: any;        // 公司服务器的 geometryService 服务
  public drawBoxFlag: boolean;          // 地图标会按钮显示、隐藏标志
  public onDrawEndHandler: any;         // 地图上绘画时处理的方法。
  public currentPictureSymbol: any;     // 地图图片处理。
  public currentTextSymbol: any;        // 地图文字处理。

  //---加载的arcgis API 模块-------------------
  private Extent: any;
  private Map: any;
  private Topic: any;
  private ArcGISTiledMapServiceLayer: any;    //图层
  private FlashFeatureLayer: any;             //图层
  private Scalebar: any;                      //比例尺
  private GraphicsUtils: any;                 //图形
  private SimpleMarkerSymbol: any;
  private SimpleLineSymbol: any;
  private SimpleFillSymbol: any;
  private PictureMarkerSymbol: any;
  private TextSymbol: any;
  private Navigation: any;                    // 导航
  private Draw: any;                          // 绘图
  private Graphic: any;                       // 图形管理
  private WebMercatorUtils: any;              // 将墨卡托坐标转换为地理位置
  private LengthsParameters: any;             // 设置长度操作的长度单位和其他参数
  private GeometryService: any;               // 由ArcGIS Server REST API公开的几何服务资源
  private Point: any;                         // 由X和Y坐标定义的位置。它可以是地图单位或屏幕单位
  private AreasAndLengthsParameters: any;     // 在几何服务上输入areasAndLengths（）方法的参数。设置lengthunits，areaUnit等参数。
  private DrawLayer: any;                     // 自定义API， 用于在地图上绘画的空图层。
  private Event: any;                         //
  //-----------------------------------------

  constructor(private http: Http,
              public commonService: CommonService,
              private esriLoader: EsriLoaderService) {
    Object.assign(this, { gisOption });

    this.navigate = null;
    this.arcGisLoadFinish = false;      // 初始化， 设置API加载完毕开端
    this.queryLayerPoint = 1;           // 初始化查询点的值
    this.queryLayerId = '石油线路竞标';   // 初始化搜索的图层ID
    this.businessLayerConf = gisOption.map.optionLayers;
    this.drawBoxFlag = false;           // 隐藏 地图标绘的按钮
    this.currentPictureSymbol = null;
    this.currentTextSymbol = null;
  }

  //加载arcgis API模块
  private loadEsriModules() {

    this.esriLoader.load({
      // url: '//js.arcgis.com/3.18/'
      // url: 'http://localhost:3000/library/3.18/init.js',
      url: gisOption.arcgisJS_API_url,
    }).then(() => {
      let that = this
      this.esriLoader.loadModules([
        "esri/geometry/Extent",                     // 边界框的最小和最大X和Y坐标。
        "esri/map",
        "dojo/topic",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/dijit/Scalebar",                      // 比例尺
        "extras/FlashFeatureLayer",                 // 自定义的API，业务图层使用这个搜索要素有闪烁效果
        "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/TextSymbol",
        "esri/toolbars/navigation",                 // 支持基本导航的工具栏，如平移和缩放
        "esri/toolbars/draw",                       // 绘制工具
        "esri/graphic",                             // 图形
        "esri/geometry/webMercatorUtils",           // 坐标转换： 将墨卡托坐标转换为地理位置
        "esri/tasks/LengthsParameters",             // 设置长度操作的长度单位和其他参数
        "esri/tasks/GeometryService",               // 由ArcGIS Server REST API公开的几何服务资源
        "esri/geometry/Point",                      // 由X和Y坐标定义的位置。它可以是地图单位或屏幕单位
        "esri/tasks/AreasAndLengthsParameters",     //
        "extras/DrawLayer",                         //自定义的API 绘画图层
        "dojo/_base/event",

        "dojo/domReady!"
      ]).then(([Extent, Map, Topic, ArcGISTiledMapServiceLayer, Scalebar, FlashFeatureLayer, graphicsUtils,
                 SimpleMarkerSymbol, SimpleLineSymbol, PictureMarkerSymbol, SimpleFillSymbol, TextSymbol,
                 Navigation, Draw, Graphic, WebMercatorUtils, LengthsParameters, GeometryService, Point,
                 AreasAndLengthsParameters, DrawLayer, Event]) => {
        this.Extent   = Extent;
        this.Map      = Map;
        this.Topic    = Topic;
        this.Scalebar = Scalebar;
        this.ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer;
        this.FlashFeatureLayer   = FlashFeatureLayer;
        this.GraphicsUtils       = graphicsUtils;
        this.SimpleMarkerSymbol  = SimpleMarkerSymbol;
        this.SimpleLineSymbol    = SimpleLineSymbol;
        this.PictureMarkerSymbol = PictureMarkerSymbol;
        this.SimpleFillSymbol    = SimpleFillSymbol;
        this.TextSymbol          = TextSymbol;
        this.Navigation          = Navigation;
        this.Draw                = Draw;
        this.Graphic             = Graphic;
        this.WebMercatorUtils    = WebMercatorUtils;
        this.LengthsParameters   = LengthsParameters;
        this.GeometryService     = GeometryService;
        this.Point               = Point;
        this.AreasAndLengthsParameters = AreasAndLengthsParameters;
        this.DrawLayer           = DrawLayer;
        this.Event               = Event;

        this.arcGisLoadFinish = true;   //API加载完毕开关。
      })
    })


  }

  ngOnInit() {
    this.loadEsriModules();

    //间隔0.5秒检查一次 API 是否加载完毕， 如果加载完毕则退出
    let timer = setInterval(() => {
      //如果 API加载完毕则接着执行
      if (this.arcGisLoadFinish) {
        let baseMapOption = gisOption.map.basemaps.baseMapLayers[gisOption.map.useWhereBaseMap];
        let options = {
          "sliderStyle": "large",
          "logo": false,
          "showAttribution": false,
          "showLabels": true,
          "extent": new this.Extent(baseMapOption.extent),
        };
        //添加底图
        let baseMapURL = baseMapOption.baseMap.url;
        let baseMap = baseMapOption.baseMap.info;
        this.arcGisMap = new this.Map(this.mapView.nativeElement, options);
        let layer = new this.ArcGISTiledMapServiceLayer(baseMapURL, baseMap);
        this.arcGisMap.addLayer(layer, baseMap.index);

        // 添加业务图层
        for (let i = 0; i < this.businessLayerConf.length; i++) {
          let businessLayer = new this.FlashFeatureLayer(this.businessLayerConf[i].url, this.businessLayerConf[i]);
          this.arcGisMap.addLayer(businessLayer);
        }

        //arcgis插件
        this.loadArcGisWidget();

        // 创建本地服务器的 GeometryService 服务
        let geometryServiceURL = gisOption.services.geometryServiceURL;
        this.myGeometryService = new this.GeometryService(geometryServiceURL)

        clearInterval(timer);   //跳出这个函数循环
      }
    }, 500);

  }

  //arcgis插件：比例尺
  private loadArcGisWidget() {
    //比例尺
    this.Scalebar({ map: this.arcGisMap, scalebarUnit: "dual" });
  }

  public positionBtn() {

    let defaultConstruct = {
      "repeatCount": 5,         //闪烁5次
      "delay": 500,             //每次闪烁0.5秒
      "fieldName": "OBJECTID",  //查询的字段
      "center": true
    }
    let layer = this.arcGisMap.getLayer(this.queryLayerId)
    //在找一次图层
    if (!layer) {
      // console.info("没有找到该图层，layerId=" + this.queryLayerId);
      let layerIds = this.arcGisMap.graphicsLayerIds;
      if (layerIds.indexOf(this.queryLayerId) != -1) {
        layer = this.arcGisMap._layers[this.queryLayerId];
        layer.setVisibility(true);
      }
      // console.log('换种方法查找，找到了！！！！')
    }
    // 如果图层没找到
    if (!layer) {
      console.error("无法定位，错误的名字：" + this.queryLayerId);
      return;
    }

    //这个是封装好的闪烁效果
    if (layer.flash && typeof layer.flash === "function") {
      layer.flash(this.queryLayerPoint, defaultConstruct);
      return;
    }

    //TODO 这个有问题，暂时没有时间来从新编写，以后有时间完善开发
    if (defaultConstruct.fieldName != '') {
      let graphics = [];
      let gra = null;
      for (let i = 0; i != layer.graphics.length; i++) {
        gra = layer.graphics[i];
        if (gra && gra.attributes && this.queryLayerPoint == gra.attributes[defaultConstruct.fieldName]) {
          graphics.push(gra);
        }
      }
      if (graphics.length > 0) {
        this.flash(graphics, defaultConstruct);
      }
    }


  }

  //TODO 目前这个自己写的闪烁有问题，第一次点击没有反应，第二次点击才闪，
  //TODO 这个根据油气事业部代码来写的，他们的也有这个问题，等以后有时间了参考他们封装的方法来写
  /*设置查找的点闪烁
  * graphic 查询的点
  * options 闪烁的选项
  * */
  public flash(graphic, options) {

    if (options.center === true) {
      // let extent = this.GraphicsUtils.graphicsExtent(graphic);
      this.arcGisMap.setExtent(this.GraphicsUtils.graphicsExtent(graphic));
    }
    let count = options.repeatCount;
    let highlight = true;
    let gra = null;
    let __this = this;
    let flashInterval = setInterval(function () {
      if (count > 0) {
        count--;
        // setGraphicSymbol(graphic, highlight);
        for (let i = 0; i != graphic.length; i++) {
          gra = graphic[i];
          console.log('gra.symbol=====')
          console.log(gra.symbol)
          gra.setSymbol(highlight ? __this.setHighLightSymbol(gra.geometry.type) : null);
          console.log(gra.symbol)
        }

        highlight = !highlight;
      } else {
        clearInterval(flashInterval);
      }

    }, options.delay);

  }

  /*设置闪烁块的颜色类
  * type  闪烁块的类型
  * */
  public setHighLightSymbol(type) {
    let obj = null;
    //设置参数
    switch (type) {
      case "point":
      case "multipoint":
        obj = {
          "type": "esriSMS",
          "color": [255, 0, 255, 255],
          "size": 10, "angle": 0, "xoffset": 0, "yoffset": 0, "style": "esriSMSCircle",
          "outline": {
            "color": [255, 0, 255, 255],
            "width": 0,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          }
        };
        break;
      case "polyline":
        obj = {
          "type": "esriSLS",
          "style": "esriSLSSolid", "color": [255, 0, 255, 255], "width": 2
        };
        break;
      case "polygon":
        obj = {
          "type": "esriSFS",
          "style": "esriSFSSolid", "color": [115, 76, 45, 100],
          "outline": {
            "type": "esriSLS",
            "style": "esriSLSSolid", "color": [255, 0, 255, 255], "width": 2
          }
        };
        break;
      default:
        ;
    }
    //创建块对象
    let symbol = null;
    switch (obj.type) {
      case "esriSMS" :
        symbol = new this.SimpleMarkerSymbol(obj);
        break;
      case "esriSLS" :
        symbol = new this.SimpleLineSymbol(obj);
        break;
      case "esriSFS" :
        symbol = new this.SimpleFillSymbol(obj);
        break;
      case "esriPMS" :
        symbol = new this.PictureMarkerSymbol(obj);
        break;
      case "esriTS" :
        symbol = new this.TextSymbol(obj);
        break;
      default:
        ;
    }

    return obj;

  }


  //平移按钮处理时间
  //TODO 这里好像少一个 取消绘画编辑的处理方法，以后留意一下
  public moveMap() {
    if (null == this.navigate) {
      this.navigate = new this.Navigation(this.arcGisMap)
    }
    //停用工具栏并重新启动地图导航
    this.navigate.deactivate();
    this.navigate.activate(this.Navigation.PAN);
    this.arcGisMap.setMapCursor("pointer");
  }

  //放大地图
  public zoomIn() {
    if (null == this.navigate) {
      this.navigate = new this.Navigation(this.arcGisMap)
    }
    this.navigate.deactivate();
    this.arcGisMap.setMapCursor("default");
    this.navigate.activate(this.Navigation.ZOOM_IN);
  }

  //缩小地图
  public zoomOut() {
    if (null == this.navigate) {
      this.navigate = new this.Navigation(this.arcGisMap)
    }
    this.navigate.deactivate();
    this.arcGisMap.setMapCursor("default");
    this.navigate.activate(this.Navigation.ZOOM_OUT);
  }

  //测量距离按钮处理方法
  public getLength() {
    let __this = this;
    this.drawGraphic(this.Draw.POLYLINE, (geo) => {
      if (geo) {
        let p = new __this.LengthsParameters();
        p.polylines = [geo];
        p.lengthUnit = __this.GeometryService.UNIT_METER;
        p.geodesic = true;
        __this.myGeometryService.lengths(p, function (result) {
          let path = geo.paths[0];
          let xy = path[path.length - 1];
          let coors;
          let wkid = __this.arcGisMap.spatialReference.wkid;
          //判断web墨卡托投影
          switch (wkid) {
            case 102100: ;
            case 3857:
              coors = __this.WebMercatorUtils.lngLatToXY(xy[0], xy[1]);
              break;
            default:
              coors = [xy[0], xy[1]];
          }
          let point = new __this.Point(coors[0], coors[1], __this.arcGisMap.spatialReference);
          let length = result.lengths[0];
          let textLabel = "";
          if (length <= 1000) {
            textLabel = length.toFixed(2) + " m";
          } else {
            textLabel = (length / 1000).toFixed(2) + " km";
          }
          let symbol = new __this.TextSymbol(textLabel);
          let graphic = new __this.Graphic(point, symbol);
          // 把计算的结果添加到地图上
          __this.arcGisMap.graphics.add(graphic);
        }, function (e) {
          console.error("计算距离出错！");
          console.error(e);
        })
      }
    })

  }

  //测量面积按钮处理方法
  public getAreaBtn() {
    let __this = this;
    this.drawGraphic(this.Draw.POLYGON, (geo) => {
      if(geo) {
        let p = new __this.AreasAndLengthsParameters();
        p.polygons = [geo];
        p.lengthUnit = __this.GeometryService.UNIT_KILOMETER;
        p.areaUnit = __this.GeometryService.UNIT_SQUARE_KILOMETERS;
        __this.myGeometryService.areasAndLengths(p, function (result) {
          let re = result.areas[0].toFixed(2);
          var point = geo.getExtent().getCenter();
          var symbol = new __this.TextSymbol(re + " km²");
          var graphic = new __this.Graphic(point, symbol);
          __this.arcGisMap.graphics.add(graphic);

        }, function (e) {
          console.error("计算面积出错！");
          console.error(e);
        });
      }
    })

  }

  //清除所有绘画的图形
  public clearAllGraphics() {
    //TODO 这里可能还有别的需要清除，以后来检查drawLayer
    this.arcGisMap.graphics.clear();
  }

  /**根据Draw对象画图形
   * @param drawType        绘画类型
   * @param DrawEndedFunc     绘画结束后要做的事情函数
   *
   */
  public drawGraphic(drawType, DrawEndedFunc: Function) {
    let draw = new this.Draw(this.arcGisMap);
    if (this.navigate) {
      this.navigate.deactivate();
    }
    let __this = this;
    // 画图前先把之前的绘画清除，如果之前有绘画的 话
    if (this.onDrawEndHandler) {
      this.onDrawEndHandler.remove();
      this.onDrawEndHandler = null;
    }
    this.onDrawEndHandler = draw.on("draw-end", function (evt) {
      let symbol;
      draw.deactivate();
      __this.arcGisMap.showZoomSlider();          // 显示地图上的缩放滑块
      __this.arcGisMap.setMapCursor("default");   //设置鼠标指针形状为默认
      switch (evt.geometry.type) {
        case "point":
        case "multipoint":
          symbol = new __this.SimpleMarkerSymbol();
          break;
        case "polyline":
          symbol = new __this.SimpleLineSymbol();
          break;
        default:
          symbol = new __this.SimpleFillSymbol();
          break;
      }
      let graphic = new __this.Graphic(evt.geometry, symbol);
      if (!graphic.attributes) {
        graphic.attributes = {};
      }
      // 把画的线添加到地图上
      __this.arcGisMap.graphics.add(graphic);

      //判断坐标系，将坐标转化为地理坐标
      let geo = null;
      if (graphic.geometry.spatialReference.wkid == 3857 || graphic.geometry.spatialReference.wkid == 102100) {
        geo = __this.WebMercatorUtils.webMercatorToGeographic(graphic.geometry);
      } else {
        geo = graphic.geometry;
      }
      //绘图结束，执行相关操作
      DrawEndedFunc(geo);
    })
    //开始画图
    draw.activate(drawType);
    this.arcGisMap.hideZoomSlider();            //隐藏缩放滑块
    this.arcGisMap.setMapCursor("crosshair");   // 鼠标指针变加号形状
  }

  //在图层上绘画： 点、线、面、圆、椭圆、矩形、图标、文字
  //只有绘画，还没有编辑功能
  public startDrawAndEdit(option) {
    let params = {
      layerId: "drawAndEditLayerId",
      onDrawEnd: function (gra) { },
      onDrawGraphicClick: function (e) { },
      onDrawGraphicDbClick: function (e) { }
    };
    // 画图前先把之前的绘画清除，如果之前有绘画的 话
    if (this.onDrawEndHandler) {
      this.onDrawEndHandler.remove();
      this.onDrawEndHandler = null;
    }
    let drawLayer = this.arcGisMap.getLayer(params.layerId);
    if (!drawLayer) {
      drawLayer = new this.DrawLayer({ id: params.layerId, index: 100 });
      this.arcGisMap.addLayer(drawLayer);
    }
    let draw = new this.Draw(this.arcGisMap);
    let __this = this;
    //准备画图
    let drawType = option;
    let onDeleteDrawGraphicHander = null;
    switch (option) {
      case 'DELETE':
        onDeleteDrawGraphicHander = drawLayer.on('click', function (e) {
          drawLayer.remove(e.graphic);
          __this.Event.stop(e);
        });
        break;
      case 'PICTURE':
      case 'TEXT':
        option = "POINT";
      default:
        if (onDeleteDrawGraphicHander) {
          onDeleteDrawGraphicHander.remove();
          onDeleteDrawGraphicHander = null;
        }
        draw.activate(__this.Draw[option]);
        __this.arcGisMap.hideZoomSlider();  //隐藏缩放条
    }

    //绘图完成添加完成处理方法
    this.onDrawEndHandler = draw.on('draw-end', function (evt) {
      draw.deactivate();
      draw = null;
      __this.arcGisMap.showZoomSlider();
      let symbol;
      switch (evt.geometry.type) {
        case "point":
          if (drawType === "PICTURE") {
            if (!__this.currentPictureSymbol)
              __this.currentPictureSymbol = __this.PictureMarkerSymbol({
                "type": "esriPMS",
                "url": "assets/img/arcgis/plot/pic_government.png",
                "contentType": "image/png",
                "color": null,
                "width": 19.5,
                "height": 19.5,
                "angle": 0,
                "xoffset": 0,
                "yoffset": 0
              });
            symbol = __this.currentPictureSymbol;
          } else if (drawType === "TEXT") {
            if (!__this.currentTextSymbol)
              __this.currentTextSymbol = __this.TextSymbol({ "type": "esriTS", "text": "文字" });
            symbol = __this.currentTextSymbol;
          } else {
            symbol = new __this.SimpleMarkerSymbol();
          }
          break;
        case "multipoint":
          symbol = new __this.SimpleMarkerSymbol();
          break;
        case "polyline":
          symbol = new __this.SimpleLineSymbol();
          break;
        default:
          symbol = new __this.SimpleFillSymbol();
          break;
      }
      let graphic = new __this.Graphic(evt.geometry, symbol);
      params.onDrawEnd(graphic);
      //把绘画添加到图层上
      drawLayer.add(graphic);
    });
  }


}
