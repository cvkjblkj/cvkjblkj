import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// also import the "angular2-esri-loader" to be able to load JSAPI modules
import { EsriLoaderService } from 'angular2-esri-loader';

import { Headers, Http, Jsonp, Response } from "@angular/http";
import { CommonService } from './../../../core/common-service/common.service';
import { ConfirmationService } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'arc-gis-map',
  templateUrl: 'arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.css', './../../journal-info/login-journal/login-journal.component.scss'],
  providers: [CommonService, ConfirmationService]
})

export class ArcGisMap {

  // for JSAPI 4.x you can use the "any for TS types
  public mapView: __esri.MapView;

  map: any;
  view: any;
  is3D: boolean;                    //是否是3D地图
  public showLayerFlag: boolean;    //是否显示图层列表标志
  public overViewShowFlag: boolean;    //是否显示图层列表标志

  // baseMaps = [
  //   { label: 'streets', value: 'streets' },
  //   { label: 'satellite', value: 'satellite' },
  //   { label: 'hybrid', value: 'hybrid' },
  //   { label: 'topo', value: 'topo' },
  //   { label: 'gray', value: 'gray' },
  //   { label: 'dark-gray', value: 'dark-gray' },
  //   { label: 'oceans', value: 'oceans' },
  //   { label: 'national-geographic', value: 'national-geographic' },
  //   { label: 'terrain', value: 'terrain' },
  //   { label: 'osm', value: 'osm' },
  //   { label: 'dark-gray-vector', value: 'dark-gray-vector' },
  //   { label: 'gray-vector', value: 'gray-vector' },
  //   { label: 'streets-vector', value: 'streets-vector' },
  //   { label: 'topo-vector', value: 'topo-vector' },
  //   { label: 'streets-night-vector', value: 'streets-night-vector' },
  //   { label: 'streets-relief-vector', value: 'streets-relief-vector' },
  //   { label: 'streets-navigation-vector', value: 'streets-navigation-vector' },
  // ];     //地图基本样式：街道图、海洋图、卫星图等
  private baseMap = 'topo';   //选择的地图

  private layerBtnLists: any[];          //图层按钮数据
  private layerBtnListsSelect: any;          //图层按钮数据

  //加载的arcgis API
  private esriMap: any;
  private esriMapImageLayer: any;
  private esriMapView: any;
  private esriSceneView: any;
  private esriFeatureLayer: any;
  private esriHome: any;
  private esriBasemapGallery: any;
  private esriExpand: any;
  private esriSearch: any;
  private esriScaleBar: any;
  private esriwatchUtils: any;
  private esridom: any;

  private arcGisLoadFinish: boolean;    //arcgis API加载完毕标志


  //地图服务地址
  private mapServer = 'http://192.168.100.52:6080/arcgis/rest/services';

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('arcGisMapDiv') private arcGisMapDiv: ElementRef;

  constructor(private http: Http,
              public commonService: CommonService,
              private esriLoader: EsriLoaderService) {
  }

  //获取arcgis API加载的模块
  private loadEsriModules() {
    //来自：https://github.com/StefanNieuwenhuis/awesome-mapping-app
    this.esriLoader.load({
      // url: 'https://js.arcgis.com/4.4/'
      // url: 'http://192.168.100.92/api/arcgis_js_v44_api/arcgis_js_api/library/4.4/init.js'
      url: 'arcgisAPI/arcgis_js_api/library/4.4/init.js'
      // url: 'http://localhost:3000/library/4.4/init.js',
    }).then(() => {
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/layers/MapImageLayer',    //地图 图层服务
        'esri/views/MapView',           //2D地图
        'esri/views/SceneView',         //3D地图
        //https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#source
        "esri/layers/FeatureLayer",     //提取图层服务
        "esri/widgets/Home",            //在视图中出现一个回到原点的按钮Home
        "esri/widgets/BasemapGallery",
        "esri/widgets/Expand",
        "esri/widgets/Search",//地点搜索
        "esri/widgets/ScaleBar",//比例尺
        "esri/core/watchUtils", //鹰眼图
        "dojo/dom",             //鹰眼图
      ]).then(([Map, MapImageLayer, MapView, SceneView, FeatureLayer, Home,
                 BasemapGallery, Expand, Search, ScaleBar, watchUtils, dom]) => {
        this.esriMap = Map;
        this.esriMapImageLayer = MapImageLayer;
        this.esriMapView = MapView;
        this.esriSceneView = SceneView;
        this.esriFeatureLayer = FeatureLayer;
        this.esriHome = Home;
        this.esriBasemapGallery = BasemapGallery;
        this.esriExpand = Expand;
        this.esriSearch = Search;
        this.esriScaleBar = ScaleBar;
        this.esriwatchUtils = watchUtils;
        this.esridom = dom;

        this.arcGisLoadFinish = true;
      })
    })
  }

  public ngOnInit() {

    this.getMapLayers();  //获取arcgis服务图层数据
    this.arcGisLoadFinish = false;  //arcgis没有加载好标志
    this.loadEsriModules();   //加载arcgis API模块文件
    this.showLayerFlag = false;  //关闭图层按钮
    this.overViewShowFlag = false;  //鹰眼图关闭

    let timer = setInterval(() => {
      //如果arcgis模块加载完毕
      if (this.arcGisLoadFinish) {
        //https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
        this.map = new this.esriMap({
          basemap: this.baseMap,
          ground: "world-elevation"
        });
        let initialViewParams = {
          container: this.arcGisMapDiv.nativeElement,
          center: [116.4, 39.9], //北京天安门，经纬度坐标http://api.map.baidu.com/lbsapi/getpoint/index.html
          zoom: 7,           //放大级别最小 1，最大20
          map: this.map
        };
        this.view = new this.esriMapView(initialViewParams);
        //设置最小缩放比例
        this.view.constraints = { minZoom: 3, };
        this.is3D = false;
        //添加自己的地图的arc地图中
        // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-MapImageLayer.html
        // var layer = new MapImageLayer({
        //   url: "http://192.168.100.52:6080/arcgis/rest/services/SampleWorldCities/MapServer",
        // });
        this.loadArcGisWidget();   //加载插件
        clearInterval(timer);
      }
    }, 500);

  }

  /*鹰眼图插件
  *https://developers.arcgis.com/javascript/latest/sample-code/index.html?search=overview
  * */
  private overViewMap() {
    let smallMap = new this.esriMap({ basemap: "topo" });
    let smallView = new this.esriMapView({ container: "overviewDiv", map: smallMap, });
    //设置最小缩放比例
    smallView.constraints = { minZoom: 1, };
    smallView.ui.components = [];
    let extentDiv = this.esridom.byId("extentDiv");
    let watchUtils = this.esriwatchUtils;
    let bigView = this.view;
    smallView.then(function () {
      bigView.watch("extent", updateOverviewExtent);
      smallView.watch("extent", updateOverviewExtent);
      watchUtils.when(bigView, "stationary", updateOverview);

      function updateOverview() {
        smallView.goTo({
          center: bigView.center,
          scale: bigView.scale * 2 * Math.max(bigView.width / smallView.width,
            bigView.height / smallView.height)
        });
      }

      function updateOverviewExtent() {
        var extent = bigView.extent;
        var bottomLeft = smallView.toScreen(extent.xmin, extent.ymin);
        var topRight = smallView.toScreen(extent.xmax, extent.ymax);
        extentDiv.style.top = topRight.y + "px";
        extentDiv.style.left = bottomLeft.x + "px";
        extentDiv.style.height = (bottomLeft.y - topRight.y) + "px";
        extentDiv.style.width = (topRight.x - bottomLeft.x) + "px";
      }
    });
  }


  //arcgis插件：返回原点，更换底图，搜索功能，添加比例尺
  private loadArcGisWidget() {
    //返回原点功能 https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Home.html
    var homeWidget = new this.esriHome({
      view: this.view
    });
    // adds the home widget to the top left corner of the MapView
    this.view.ui.add(homeWidget, "top-left");

    //更换底图（街道图，卫星图插件）
    // https://developers.arcgis.com/javascript/latest/sample-code/widgets-expand/index.html
    var basemapGallery = new this.esriBasemapGallery({
      view: this.view,
      // container: this.arcGisMapDiv.nativeElement
      container: document.createElement("div")
    });
    var bgExpand = new this.esriExpand({
      view: this.view,
      content: basemapGallery.domNode,
      expandIconClass: "esri-icon-basemap"
    });
    this.view.ui.add(bgExpand, "top-left");

    //添加搜索功能
    var search = new this.esriSearch({ view: this.view });
    this.view.ui.add(search, "top-right");

    //添加比例尺插件，只有 2D地图才有比例尺插件
    //https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-ScaleBar.html
    var scaleBar = new this.esriScaleBar({ view: this.view, unit: "dual" });
    this.view.ui.add(scaleBar, "bottom-left");

    //鹰眼图
    this.overViewMap()
  }

  //切换2D  3D地图按钮处理方法
  Switch2DTo3D(event) {
    //获得修改按钮value的变量，Google浏览器与火狐浏览器
    let btnValue = event.srcElement ? event.srcElement : event.target;
    let initialViewParams = { container: this.arcGisMapDiv.nativeElement, map: this.map };
    let MapView;
    if (this.is3D) {
      MapView = new this.esriMapView(initialViewParams);
      btnValue.value = '3D';
      //设置最小缩放比例
      MapView.constraints = { minZoom: 3, };
      this.is3D = false;
    } else {
      MapView = new this.esriSceneView(initialViewParams);
      btnValue.value = '2D';
      this.is3D = true;
    }
    if (this.view && this.view.viewpoint) {
      MapView.viewpoint = this.view.viewpoint.clone();
    }
    this.view = MapView;
    this.loadArcGisWidget();//加载插件
  }


  /* 改变基本地图样式按钮处理方法；（卫星图、街道图、海洋图）
   * */
  // changeBaseMap(event) {
  //   this.map = new this.esriMap({
  //     basemap: this.baseMap,
  //     ground: "world-elevation"
  //   })
  //   let initialViewParams = {
  //     container: this.arcGisMapDiv.nativeElement,
  //     map: this.map
  //   };
  //   let view;
  //   view = this.is3D ? (new this.esriSceneView(initialViewParams)) : (new this.esriMapView(initialViewParams));
  //   //当地图放大时，获取放大后的地图位置
  //   if (this.view && this.view.viewpoint) {
  //     view.viewpoint = this.view.viewpoint.clone();
  //   }
  //   this.view = view;
  //   //加载插件
  //   this.loadArcGisWidget();
  // }


  /* 获取地图的 图层
   * dsadsa
   * */
  private getMapLayers() {
    this.layerBtnLists = [
      {
        "label": "全选",
        "data": "全选",
        'expanded': true,
        "children": []
      }
    ];
    let finishFlag = false;
    //获取服务器里有几个 图层服务
    this.http.get(this.mapServer + '?f=pjson')
      .toPromise()
      .then((res: Response) => {
        let rel = res.json();
        let tmp;
        let str = '';
        if (!rel.services) return;    //如果没有结果则退出 .then
        for (let e of rel.services) {
          //当没有这个服务的时候，排除的代码要删除
          if (e.type == "FeatureServer") continue;  //如果是FeatureServer 则丢弃
          if (e.name == "zhaozhao" || e.name == 'postgisService') continue;  //如果是zhaozhao  postgisService则丢弃
          str = e.name + '/' + e.type;
          tmp = { 'label': str, 'data': e, 'expanded': true, 'children': [] };
          this.layerBtnLists[0].children.push(tmp);
        }
        finishFlag = true;
      }).catch(error => {
      console.log("查询MapService时发生错误，错误信息：");
      console.error(error);
    });

    let timer = setInterval(() => {
      if (finishFlag) {
        for (let e of this.layerBtnLists[0].children) {
          //获取 图层服务中的图层
          this.http.get(this.mapServer + '/' + e.label + '/layers?f=pjson')
            .toPromise()
            .then((res: Response) => {
              let rel = res.json();
              if (!rel.layers) return;  //如果没有数据退出 .then
              for (let row of rel.layers) {
                if (row.name == 'Continent'|| row.name == 'World') continue;  //如果图层名字是这些，则丢弃
                e.children.push({
                  'label': row.name,
                  'data': { 'url': this.mapServer + '/' + e.label + '/' + row.id, 'data': row }
                })
              }
            }).catch(error => {
            console.log("查询MapService中有几个layer时发生错误，错误信息：");
            console.error(error);
          });
        }
        clearInterval(timer);
      }
    }, 1000);

  }

  /*添加图层
  * 查询图层每个点信息文档：https://developers.arcgis.com/javascript/latest/sample-code/featurelayerview-query/index.html
  * */
  addMapLayre() {
    this.view.map.removeAll();
    for (let e of this.layerBtnListsSelect) {
      if (e.data && e.data.url) {
        //https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#properties-summary
        let layer = new this.esriFeatureLayer({
          outFields: ["*"],             //把每个点的所有属性都查询出来。
          // popupTemplate: popupTemplate, //弹窗模板
          popupTemplate: this.pupupTemplate(e.label), //弹窗模板
          url: e.data.url               //图层服务地址
        });
        this.view.map.add(layer);  // adds the layer to the map
      }
    }

  }

  /*图层上点信息的模板，根据不同图层，对应返回相应的模板
  * 参考链接：https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#popupTemplate
  * */
  private pupupTemplate(name) {
    if (name == 'Cities') {
      return {
        title: 'Cities',
        content: "<p> 城市: {CITY_NAME}</p>" +
        "<p> 等级: {POP_RANK}</p>"
      }
    } else if (name == 'SDEUSER.PD_LINE') {
      return {
        title: 'SDEUSER.PD_LINE',
        content: "<p> BEGINLOCATIONINFO: {BEGINLOCATIONINFO}</p>" +
        "<p> BEGINSTATION: {BEGINSTATION}</p>" +
        "<p> BEGINSTATIONSERIESEVENTID: {BEGINSTATIONSERIESEVENTID}</p>" +
        "<p> COORSYSTEMCODE: {COORSYSTEMCODE}</p>" +
        "<p> COUNTY: {COUNTY}</p>" +
        "<p> CREATEDBY: {CREATEDBY}</p>" +
        "<p> CREATEDDATE: {CREATEDDATE}</p>" +
        "<p> DESIGNFLOWRATE: {DESIGNFLOWRATE}</p>" +
        "<p> DESIGNPRESSURE: {DESIGNPRESSURE}</p>" +
        "<p> DIAMETER: {DIAMETER}</p>" +
        "<p> ENDLOCATIONINFO: {ENDLOCATIONINFO}</p>" +
        "<p> ENDPOINT: {ENDPOINT}</p>" +
        "<p> ENDRELATIVEMILEAGE: {ENDRELATIVEMILEAGE}</p>" +
        "<p> ENDSTAKENUMBER: {ENDSTAKENUMBER}</p>" +
        "<p> ENDSTATION: {ENDSTATION}</p>" +
        "<p> ENDSTATIONSERIESEVENTID: {ENDSTATIONSERIESEVENTID}</p>" +
        "<p> ENDSUBNUMBER: {ENDSUBNUMBER}</p>" +
        "<p> EVENTID: {EVENTID}</p>" +
        "<p> INITIALPOINT: {INITIALPOINT}</p>" +
        "<p> INITIALRELATIVEMILEAGE: {INITIALRELATIVEMILEAGE}</p>" +
        "<p> INITIALSTAKENUMBER: {INITIALSTAKENUMBER}</p>" +
        "<p> INITIALSUBNUMBER: {INITIALSUBNUMBER}</p>" +
        "<p> LASTMODIFIED: {LASTMODIFIED}</p>" +
        "<p> LINEID: {LINEID}</p>" +
        "<p> MEDIUMTYPE: {MEDIUMTYPE}</p>" +
        "<p> MODIFIEDBY: {MODIFIEDBY}</p>" +
        "<p> OBJECTID: {OBJECTID}</p>" +
        "<p> PIPELINELENGTH: {PIPELINELENGTH}</p>" +
        "<p> PIPELINENAME: {PIPELINENAME}</p>" +
        "<p> PIPELINENUMBER: {PIPELINENUMBER}</p>" +
        "<p> PIPELINETYPE: {PIPELINETYPE}</p>" +
        "<p> PROVINCE: {PROVINCE}</p>" +
        "<p> SHAPE.LEN: {SHAPE.LEN}</p>" +
        "<p> WALLTHICKNESS: {WALLTHICKNESS}</p>"
      }
    } else if (name == 'PD_POINT') {
      return {
        title: 'PD_POINT',
        content: "<p> 创建者: {CREATEDBY}</p>" +
        "<p> 创建日期: {CREATEDDATE}</p>" +
        "<p> X: {X}</p>" +
        "<p> Y: {Y}</p>"
      }
    }

  }

  /**
   * 取消冒泡
   * @param e 事件对象
   */
  stopBubble(e) {
    this.commonService.stopBubble(e);
  }


//点击其他区域关闭下拉列表弹窗
  public modalHidden(event) {
    // let srcEle = event.srcElement ? event.srcElement : event.target;
    //如果点击事件不是这个元素类的事件
    // if (typeof srcEle.className == "string" && srcEle.className.indexOf('layer-Btn') != -1) {
    //   // this.showLayerBtn = true;
    // }
    this.showLayerFlag = false;  //关闭图层显示列表

  }

}

