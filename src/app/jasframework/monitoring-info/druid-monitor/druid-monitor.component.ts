import { Component, OnInit, ViewChild } from '@angular/core';
import { DruidMonitorServer } from './druid-monitor.service';
import { JasCommunicationsService } from './../../jas/shared/jas.commumication.service';
import { GlobalState } from './../../../global.state'; //一级菜单收缩按钮事件消息服务
import { Subscription } from 'rxjs/Subscription';
import { INCONFIG } from './../../../core/global';
@Component({
  selector: 'druid-monitor',
  templateUrl: 'druid-monitor.component.html',
  styleUrls: ['druid-monitor.component.scss'],
  providers: [DruidMonitorServer]
})

export class DruidMonitor implements OnInit {

  public msgs: any;
  sqlMonitor: any;
  selectData: any;
  private dataDetail: any;        //弹窗数据
  private dataSourceList: any;    //获取的数据源数据列表
  private sqlMonitorList: any;    //获取的SQL监控数据列表
  private uriMonitorList: any;    //获取的URI监控数据列表

  private dropDownServerNames: any[]; //搜索下拉框服务名字
  private selectServerName: any;      //搜索选中的服务名字
  private dropDownInfo: any;          //服务名与端口的关联信息
  private dropDownPort: any[];        //搜索下拉框端口
  private selectPort: any;            //搜索选中的端口
  private selectStartTime: any;       //搜索的开始时间
  private selectEndTime: any;         //搜索的结束时间
  private filters: any[];             //搜索的条件
  public emptyMessage: string = '未查到相关数据'; //primeng dataTable没有数据时，显示的内容
  private tabWidth: any;  //tab表单宽度设置,用于tab宽度随着网页大小变化而变化

  // 页容量,分页功能数据
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSizeDS: string = '10'; //一页多少条数据
  public pageNumDS: any = 1;  //当前页码
  public totalItemsDS: string = '10';//总共有多少条数据
  public maxSizeDS: number = 4;       //可以点击几页
  public totalPagesDS: any = '10'; //总页数
  // public size: any = '10';//选择一页有多少条数据
  //SQL分页所需变量
  private pageSizeSQL: any = '10';
  public pageNumSQL: any = 1;  //当前页码
  public totalItemsSQL: string = '10';//总共有多少条数据
  public maxSizeSQL: number = 4;       //可以点击几页
  public totalPagesSQL: any = '10'; //总页数
  //URI分页所需变量
  private pageSizeURI: any = '10';
  public pageNumURI: any = 1;  //当前页码
  public totalItemsURI: string = '10';//总共有多少条数据
  public maxSizeURI: number = 4;       //可以点击几页
  public totalPagesURI: any = '10'; //总页数

  //时间汉化
  private zh: any;
  //组件消失时,销毁订阅
  private subscription: Subscription;

  constructor(private druidServerAPI: DruidMonitorServer,
    public jasCommunicationService: JasCommunicationsService,
    public globaStateService: GlobalState
  ) {
    // 一级垂直菜单隐藏事件消息处理订阅方法
    this.globaStateService.subscribe('menu.isCollapsed', () => {
      setTimeout(() => { this.getScreenWidth(); }, 10);
      setTimeout(() => { this.getScreenWidth(); }, 100);
      setTimeout(() => { this.getScreenWidth(); }, 1000);
    });
    // 二级垂直菜单隐藏事件处理订阅方法
    this.subscription = this.jasCommunicationService.getSubscribe.subscribe(
      data => {
        if ('second-level menu change' == data) {
          setTimeout(() => { this.getScreenWidth(); }, 30);
          setTimeout(() => { this.getScreenWidth(); }, 70);
          setTimeout(() => { this.getScreenWidth(); }, 90);
          setTimeout(() => { this.getScreenWidth(); }, 120);
          setTimeout(() => { this.getScreenWidth(); }, 150);
          setTimeout(() => { this.getScreenWidth(); }, 200);
          setTimeout(() => { this.getScreenWidth(); }, 250);
          setTimeout(() => { this.getScreenWidth(); }, 1000);
        }
      },
      error => {
        // console.error(error);
      }
    );
  }

  ngOnInit() {

    //初始化搜索条件
    this.getSearchData();
    this.zh = INCONFIG.zn;
    this.getScreenWidth();

    //初始化分页数据
    this.pageNumDS = 1;
    this.pageSizeDS = '10';
    this.pageNumSQL = 1;
    this.pageSizeSQL = '10';
    this.pageNumURI = 1;
    this.pageSizeURI = '10';
    let __this = this;
    //注册窗口大小变化事件
    window.onresize = function () {
      if (0 != __this.screenWidth.nativeElement.clientWidth) {
        __this.tabWidth = __this.screenWidth.nativeElement.clientWidth;
      } else if (0 != __this.screenWidthSQL.nativeElement.clientWidth) {
        __this.tabWidth = __this.screenWidthSQL.nativeElement.clientWidth;
      } else if (0 != __this.screenWidthURI.nativeElement.clientWidth) {
        __this.tabWidth = __this.screenWidthURI.nativeElement.clientWidth;
      }
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();//销毁订阅
  }

  //获取搜索所用的数据
  getSearchData() {
    let _that = this;
    this.druidServerAPI.getServiceNameCount(_that, (data) => {
      if (data.code == '200' && data.success == 1) {
        _that.dropDownServerNames = [];
        _that.dropDownPort = [];
        _that.dropDownInfo = [];
        let ports = [];
        for (let row of data.rows) {
          ports = [];
          ports.push({ label: 'All', value: 'All' });
          for (let e of row.servicePorts) {
            ports.push({ label: e.servicePort, value: e.servicePort });
          }
          _that.dropDownServerNames.push({ label: row.serviceName, value: row.serviceName });
          _that.dropDownInfo.push({ label: row.serviceName, value: ports });
          if (data.rows[0] == row) {
            _that.selectServerName = row.serviceName;
            _that.dropDownPort = ports;
            if (_that.dropDownPort.length != 0) _that.selectPort = _that.dropDownPort[0].value;
          }
        }
        _that.selectStartTime = new Date((new Date()).getTime() - 1000 * 60 * 60);
        _that.selectEndTime = new Date();
        //初始化数据
        _that.search();
      }
    })
  }

  @ViewChild('screenWidth') screenWidth;  //分页组件的宽度变量
  @ViewChild('screenWidthSQL') screenWidthSQL;  //分页组件的宽度变量
  @ViewChild('screenWidthURI') screenWidthURI;  //分页组件的宽度变量
  //屏幕宽度获取
  getScreenWidth() {
    if (0 != this.screenWidth.nativeElement.clientWidth) {
      this.tabWidth = this.screenWidth.nativeElement.clientWidth;
    } else if (0 != this.screenWidthSQL.nativeElement.clientWidth) {
      this.tabWidth = this.screenWidthSQL.nativeElement.clientWidth;
    } else if (0 != this.screenWidthURI.nativeElement.clientWidth) {
      this.tabWidth = this.screenWidthURI.nativeElement.clientWidth;
    }
  }

  //SQL监控tab按钮是事件处理,用于获取列表宽度
  getSqlTabWidth() {
    if (0 != this.screenWidth.nativeElement.clientWidth) {
      this.tabWidth = this.screenWidth.nativeElement.clientWidth;
    } else if (0 != this.screenWidthURI.nativeElement.clientWidth) {
      this.tabWidth = this.screenWidthURI.nativeElement.clientWidth;
    }
  }

  /*搜索 服务名改变时,事件处理方法
   * name:   选择的服务名字
   * */
  onChangeService(name) {
    this.dropDownPort = [];
    for (let row of this.dropDownInfo) {
      if (name == row.label) {
        this.dropDownPort = row.value;
        if (this.dropDownPort.length != 0) this.selectPort = this.dropDownPort[0].value;
        break;
      }
    }

  }

  //搜索按钮处理事件方法
  search() {
    if ('All' == this.selectPort) {
      this.filters = [
        { "itemKey": "createTime", "filter": "gte", "itemValue": this.formatDate(this.selectStartTime).times },
        { "itemKey": "createTime", "filter": "lte", "itemValue": this.formatDate(this.selectEndTime).times },
        { "itemKey": "serviceName", "filter": "contain", "itemValue": this.selectServerName },
      ];
    } else {
      this.filters = [
        { "itemKey": "createTime", "filter": "gte", "itemValue": this.formatDate(this.selectStartTime).times },
        { "itemKey": "createTime", "filter": "lte", "itemValue": this.formatDate(this.selectEndTime).times },
        { "itemKey": "serviceName", "filter": "contain", "itemValue": this.selectServerName },
        { "itemKey": "servicePort", "filter": "contain", "itemValue": this.selectPort }
      ];
    }

    this.msgs = []; //页面消息清空
    this.getDataSourceInfo();   //获取数据源数据
    this.getSqlInfo();          //获取SQL数据
    this.getUriInfo();          //获取URI数据
  }

  /**
   * 转换中国标准时间
   * @param date 时间：中国标准时间
   * @return dates.times：当前时间的毫秒数
   * @return dates.formcatDate：当前时间的新格式 yyyy-mm-dd
   * @return dates.formatTime yyyy-mm-dd hh-mm
   */
  public formatDate(date) {
    var dateObj = new Date(date);
    var year = dateObj.getFullYear();
    var month: any = dateObj.getMonth() + 1;
    var day: any = dateObj.getDate();
    var hours = dateObj.getHours();
    var mins: any = dateObj.getMinutes();
    var second: any = dateObj.getSeconds() ? dateObj.getSeconds() : '';
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    if (mins < 10) {
      mins = '0' + mins;
    }
    if (second < 10) {
      second = '0' + second;
    }
    let time = year + "/" + month + "/" + day + ' ' + hours + ':' + mins + ':' + second;
    let times = (new Date(time)).getTime(); //得到毫秒数
    let dates = {
      times: times,
      formcatDate: year + "-" + month + "-" + day,
      formatTime: year + "-" + month + "-" + day + ' ' + hours + ':' + mins + ':' + second,
    }
    return dates;
  }

  //获取数据源信息
  getDataSourceInfo() {
    let _that = this;
    this.druidServerAPI.getDataSource(this.pageNumDS, this.pageSizeDS, this.filters, _that, (data) => {
      if (data && data.code == '200' && data.success == 1) {
        _that.dataSourceList = data.rows;
        _that.totalItemsDS = data["totalElements"];
        _that.pageSizeDS = data['size'];
        _that.totalPagesDS = data['totalPages'];
        // _that.growl('success', '列表刷新成功');
        _that.msgs.push({ severity: 'success', summary: '', detail: '数据源列表数据刷新成功' });
      } else {
        // _that.growl('error', data.msg);
        _that.msgs.push({ severity: 'error', summary: '数据源列表', detail: data.msg });
      }
    })

  }

  //获取SQL数据信息
  getSqlInfo() {
    let _that = this;
    this.druidServerAPI.getSQLMonitor(this.pageNumSQL, this.pageSizeSQL, this.filters, _that, (data) => {
      if (data && data.code == '200' && data.success == 1) {
        _that.sqlMonitorList = data.rows;
        _that.totalItemsSQL = data["totalElements"];
        _that.pageSizeSQL = data['size'];
        _that.totalPagesSQL = data['totalPages'];
        _that.msgs.push({ severity: 'success', summary: '', detail: 'SQL列表数据刷新成功' });
      } else {
        _that.msgs.push({ severity: 'error', summary: 'SQL监控列表', detail: data.msg });
      }
    })
  }

  //获取URI数据信息
  getUriInfo() {
    let _that = this;
    this.druidServerAPI.getURIMonitor(this.pageNumURI, this.pageSizeURI, this.filters, _that, (data) => {
      if (data && data.code == '200' && data.success == 1) {
        _that.uriMonitorList = data.rows;
        _that.totalItemsURI = data["totalElements"];
        _that.pageSizeURI = data['size'];
        _that.totalPagesURI = data['totalPages'];
        _that.msgs.push({ severity: 'success', summary: '', detail: 'URI列表数据刷新成功' });
      } else {
        _that.msgs.push({ severity: 'error', summary: 'URI监控列表', detail: data.msg });
      }
    })
  }

  //数据源分页大小设置
  sizeChangedDS($event: any) {
    this.msgs = []; //页面消息清空
    this.pageSizeDS = $event;
    this.pageNumDS = 1; //页容量改变时，页码值为1
    this.getDataSourceInfo(); //获取数据源数据
    //从新读取数据
  };

  //数据源分页
  paginateDS(event: any) {
    this.msgs = []; //页面消息清空
    this.pageNumDS = event.currentPage;
    this.pageSizeDS = event.itemsPerPage;
    this.getDataSourceInfo(); //获取数据源数据
  };

  //SQL分页大小设置
  sizeChangedSQL($event: any) {
    this.msgs = []; //页面消息清空
    this.pageSizeSQL = $event;
    this.pageNumSQL = 1;  //页容量改变时，页码值为1
    this.getSqlInfo();    //获取SQL数据
  };

  //SQL分页
  paginateSQL(event: any) {
    this.msgs = []; //页面消息清空
    this.pageNumSQL = event.currentPage;
    this.pageSizeSQL = event.itemsPerPage;
    this.getSqlInfo();  //获取SQL数据
  };

  //URI分页大小设置
  sizeChangedURI($event: any) {
    this.msgs = []; //页面消息清空
    this.pageSizeURI = $event;
    this.pageNumURI = 1; //页容量改变时，页码值为1
    this.getUriInfo();  //获取URI数据
  };

  // URI分页
  paginateURI(event: any) {
    this.msgs = []; //页面消息清空
    this.pageNumURI = event.currentPage;
    this.pageSizeURI = event.itemsPerPage;
    this.getUriInfo();  //获取URI数据
  };

  /**
   * 查看数据详情
   * @param viewModal 弹窗
   * @param data 当前列表项信息
   */
  @ViewChild('dataSourceBasicHeight') dataSourceBasicHeight;  //数据源弹窗
  @ViewChild('dataSourceConnectHeight') dataSourceConnectHeight;  //数据源弹窗
  @ViewChild('SQLHeight') SQLHeight;  //SQL弹窗
  @ViewChild('URIHeight') URIHeight;  //URI弹窗
  viewShow(viewModal, data) {
    this.dataDetail = null;
    this.dataDetail = data;
    //设置数据源、SQL、URI 弹窗的高度,随着屏幕高度变化而变化
    this.dataSourceBasicHeight.nativeElement.style.height = window.innerHeight - 245 + 'px';
    this.dataSourceBasicHeight.nativeElement.style.overflow = 'auto';
    this.dataSourceConnectHeight.nativeElement.style.height = window.innerHeight - 245 + 'px';
    this.dataSourceConnectHeight.nativeElement.style.overflow = 'auto';
    this.SQLHeight.nativeElement.style.height = window.innerHeight - 190 + 'px';
    this.SQLHeight.nativeElement.style.overflow = 'auto';
    this.URIHeight.nativeElement.style.height = window.innerHeight - 210 + 'px';
    this.URIHeight.nativeElement.style.overflow = 'auto';
    viewModal.show();
  }

  /**
	 * 提示信息
	 * @param rel 结果
	 * @param msg 显示信息
	 */
  public growl(rel: any, msg: any) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: msg })
  }

}

