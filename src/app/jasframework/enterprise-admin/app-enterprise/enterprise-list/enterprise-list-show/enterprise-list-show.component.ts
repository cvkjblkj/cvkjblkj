import { CommonRequestMethodService } from './../../../../../core/common-service/request-method.service';
import { AppEnterpriseService } from './../../shared/app-enterprise.service';
import { AppEnterprise } from './../../shared/app-enterprise.model';
import { AppEnterpriseApplicationService } from './../../shared/app-enterprise-application.service';
import { AppEnterpriseApplication } from './../../shared/app-enterprise-application.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { CommonService } from './../../../../../core/common-service/common.service';
import { CommonRequestService } from './../../../../../core/common-service/common-request.service';

import { AuthStatusPipe } from './enterprise-auth-list.pipe';
import { ConfirmationService } from 'primeng/primeng';
import { EnterpriseAdminService } from "../../../enterprise-auth/shared/enterprise-admin.service";

@Component({
  selector: 'jas-enterprise-list-show',
  templateUrl: './enterprise-list-show.component.html',
  styleUrls: [
    './enterprise-list-show.component.css'
  ],
  providers: [CommonService, CommonRequestService, CommonRequestMethodService, EnterpriseAdminService]
})
export class EnterpriseListShowComponent implements OnInit {
  private datas: AppEnterprise[];
  private enterpriseAppList: AppEnterpriseApplication[];

  public authenticateStatusArr: any; //认证状态
  public selectedEnterprise: any; //选中的记录
  public objectId: any; // 选中记录的objetId 值
  public detail: any; // 修改时 请求当前记录的详细数据
  model = new AppEnterprise();
  public alertIsShow: boolean = true;  // 提示信息是否出现  false(出现) true(隐藏)
  public alertMes: string;  //当 企业名称 输入信息不正确时的 提示信息
  public message: string;  //操作才完成之后的 提示信息
  public mesDisplay: boolean = false; //操作完成之后弹出框的display值
  public disable: boolean = true;  //提交按钮  状态

  public button: any = {}; // 按钮对象集合
  public menuId: any; //菜单的id
  private status: any = '';  //认证状态
  private isSearch: boolean; //点击下一页时，是否继续搜索
  private enterpriseName: string;  //企业名称
  private msgs: any; //growl 提示信息
  public emptyMessage: string = '未查到相关数据'; //primeng dataTable没有数据时，显示的内容

  @ViewChild('enterpriseListShow') enterpriseListShow; //当前组

  constructor(private appEnterpriseService: AppEnterpriseService,
    private AppEnterpriseApplicationService: AppEnterpriseApplicationService,
    private enterpriseAdminService: EnterpriseAdminService,
    private router: Router,
    public route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public commonService: CommonService,
    public commonRequestService: CommonRequestService,
    // private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService) {
  }


  // 页容量
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: string = '10';
  public pageNum: any;  //当前页码
  public totalItems: string;//总数据条数
  public maxSize: number = 4;
  public totalPages: any; //总页数
  public size: any // 页码

  // public isTrue:any;//定义应用按钮 选中后背景色
  // public isStatus: any; //定义认证状态按钮 选中后背景颜色
  public appCode: string; //应用的代码
  public enterpriseAppInfo: AppEnterpriseApplication; //企业下一条应用的信息(众多应用中的一条)
  public authenticateStatus: string; //企业的认证状态
  public searchValue: any;//  搜索框的搜索内容


  ngOnInit(): void {
    this.pageNum = 1;
    this.pageSize = '10';
    let status = '';
    this.authenticateStatus = '';
    this.enterpriseName = '';

    this.menuId = this.route.snapshot.queryParams['id'];
    if (!this.menuId) {
      this.menuId = this.route.snapshot.params['id'];
    }
    this.getEnterpriseAppList();
    this.getBtn();
    // this.onInitRequest();
    this.addEnterEvent();

  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    $('.enterprise-list-search-btn').unbind("keypress");
  }

  /**
   * 给搜索框添加enter事件
   * 
   * @memberof AppFuncComponent
   */
  addEnterEvent() {
    let _that = this;
    $('.enterprise-list-search-btn').bind('keypress', function (event) {
      if (event.keyCode == 13 && this == document.activeElement) {
        _that.searchEnterprise();
      }
    })
  }

  /*
   * 获得企业应用的名字列表
   *
   */
  getEnterpriseAppList() {
    let that = this;
    let params = {
      'pageNum': -1,
    }
    this.enterpriseAdminService.getAppNameList(params, that, result => {
      if (result["success"] === 1) {
        that.enterpriseAppList = result["rows"];
        that.appCode = that.enterpriseAppList[0]['appCode'];
        that.enterpriseAppInfo = that.enterpriseAppList[0];
        that.onInitRequest();
      }
      else {
        that.enterpriseAppList = [];
      }
    });
  }

  /*企业应用事件处理
   * e : 事件
   */
  appClick(e) {
    var e = e || window.event;
    var obj = e.target || e.srcElement;
    this.appCode = obj.id;
    if (this.appCode == 'undefined') {
      return;
    }
    this.authenticateStatus = '';
    this.enterpriseName = '';
    let that = this;
    this.appEnterpriseService.getListByApp(this.appCode, this.authenticateStatus, this.enterpriseName, this.pageNum,
      this.pageSize, that, result => {
        that.datas = result["rows"];
        that.statusPipe(that.datas);
        that.totalItems = result["totalElements"];
        that.size = result['size'];
        that.totalPages = result['totalPages']
      })

    // alert(obj.id);
  }

  //获取选择应用按钮的 企业应用信息
  getEnterpriseAppItem(value) {
    this.enterpriseAppInfo = value;
  }


  //初始化页面时 发送的请求
  onInitRequest() {
    if (typeof this.appCode == 'undefined') {
      return;
    }
    let that = this;
    this.appEnterpriseService.getListByApp(this.appCode, this.authenticateStatus, this.enterpriseName, this.pageNum,
      this.pageSize, that, result => {
        that.datas = result["rows"];
        that.statusPipe(that.datas);
        that.totalItems = result["totalElements"];
        that.size = result['size'];
        that.totalPages = result['totalPages']
        //初始化选中数据
        that.selectedEnterprise = [];
      })

  }

  /**
   * 获取初始化按钮数据
   */
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
      if (res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
        window.localStorage.setItem('enpBtn', JSON.stringify(this.button));
      } else if (res.success == -1) {
      }
    }
    )
  }

  sizeChanged($event: any) {
    console.log(event)
    this.pageSize = $event;
    this.pageNum = 1; //页容量改变时，页码值为1
    this.onInitRequest();
  };

  /*** 分页 */
  paginate(event: any) {
    console.log(event)
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    this.onInitRequest();
  };

  //  改变企业规模和审核状态

  statusPipe(data: any) {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      switch (item['enterpriseScale']) {
        case 1:
          item['enterpriseScale'] = '50人以下';
          break;
        case 2:
          item['enterpriseScale'] = '50-100人';
          break;
        case 3:
          item['enterpriseScale'] = "100-200人";
          break;
        case 4:
          item['enterpriseScale'] = "200-500人";
          break;
        case 5:
          item['enterpriseScale'] = "500人以上";
      }
      switch (item['authenticateStatus']) {
        case -1:
          item['authenticateStatus'] = '认证驳回';
          break;
        case 0:
          item['authenticateStatus'] = "未认证";
          break;
        case 1:
          item['authenticateStatus'] = "认证通过";
          break;
        case 2:
          item['authenticateStatus'] = "待审核";
      }

    }
  }

  showView(record: any) {
    let parentPath = this.activatedRoute.parent.routeConfig.path;
    let secondParentPath = this.activatedRoute.parent.parent.routeConfig.path;
    let thirdParentPath = this.activatedRoute.parent.parent.parent.routeConfig.path;
    let fourthParentPath = this.activatedRoute.parent.parent.parent.parent.routeConfig.path;
    let fifthParentPath = this.activatedRoute.parent.parent.parent.parent.parent.routeConfig.path;
    let sixthParentPath = this.activatedRoute.parent.parent.parent.parent.parent.parent.routeConfig.path;
    let seventhParentPath = this.activatedRoute.parent.parent.parent.parent.parent.parent.parent.routeConfig.path;
    let route: any = `/${seventhParentPath}/${sixthParentPath}/${fourthParentPath}/${secondParentPath}/`;
    this.objectId = record.objectId;
    let enpObj = {
      enterpriseId: this.objectId,
      enterpriseAppId: this.enterpriseAppInfo.objectId,
      enterpriseAppCode: this.enterpriseAppInfo.appCode,
    }
    window.localStorage.setItem('enpObj', JSON.stringify(enpObj));
    // 跳转页面
    this.router.navigate([`/${seventhParentPath}/${sixthParentPath}/${fourthParentPath}/${secondParentPath}/list-view`,
    { id: this.objectId, }]);
    //使菜单移动
    this.translate();

  }


  // 搜索  认证状态，企业名称

  searchEnterprise() {
    this.enterpriseName = this.searchValue ? this.searchValue : '';
    let that = this;
    this.appEnterpriseService.getListByApp(this.appCode, this.authenticateStatus, this.enterpriseName, this.pageNum,
      this.pageSize, that, result => {
        that.datas = result["rows"];
        that.statusPipe(that.datas);
        that.totalItems = result["totalElements"];
      })
  }


  // 当前页
  // private pageNum: string;
  public searchStatus(status) {
    let pageNum = 1;
    let pageSize = 10;
    this.authenticateStatus = status;
    this.enterpriseName = '';
    let that = this;
    this.appEnterpriseService.getListByApp(this.appCode, this.authenticateStatus, this.enterpriseName, this.pageNum,
      this.pageSize, that, result => {
        that.datas = result["rows"];
        that.statusPipe(that.datas);
        that.totalItems = result["totalElements"];
      })
  }

  private rel: AppEnterprise;


  onfocus() {
    this.alertIsShow = true;
  }


  /*
   *   右边菜单显示
   */
  translate() {
    //使右边菜单显示
    let targetElement = this.enterpriseListShow.nativeElement.offsetParent.offsetParent.children[0].children[0].children[0];
    console.log(targetElement)
    // console.log(targetElement.className);
    if (targetElement.className == 'modelRight') {  // 右边菜单 显示时
      targetElement.className = '';
    }
  }

  /**
   * 成功提示
   * @param rel:是否成功  msg:提示信息
   */
  public growl(rel: string, msg: string) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: msg })
  }

}
