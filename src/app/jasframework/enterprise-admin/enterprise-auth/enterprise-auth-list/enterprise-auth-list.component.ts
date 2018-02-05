import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { CommonService } from './../../../../core/common-service/common.service';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";

import { ConfirmationService } from 'primeng/primeng';
import { EnterpriseAdminModel } from "../shared/enterprise-admin.model";
import { EnterpriseAuditInfo } from "../shared/enterprise-admin.model";
import { EnterpriseAdminService } from "../shared/enterprise-admin.service"

@Component({
  selector: "jas-enterprise-auth-list",
  templateUrl: "enterprise-auth-list.component.html",
  styleUrls: [
    './enterprise-auth-list.component.css'],
  providers: [EnterpriseAdminService, ConfirmationService, CommonService, CommonRequestService,CommonRequestMethodService]
})
export class EnterpriseAuthListComponent implements OnInit {
  // 定义变量
  enterpriseAuth: EnterpriseAuditInfo[]; //待审核列表
  enterpriseAuthedList: EnterpriseAuditInfo[]; //已审核列表
  selectedEnterprise: any;
  public error: any; //提示框错误信息
  public appList: any; //应用id值
  public appCode: any; //应用code
  public appId: any; //应用id值
  // public approveStatus: any; //审核状态：0待审核 1已审核（包括通过、驳回）
  public selectId: any;

  public msgs: any;//growl 提示信息

  // 页容量数组
  public rowsPerPageOptions = ['10', '20', '30'];

  public pageSize: any; //页容量
  public authedPageSize: any; //页容量
  public pageNum: any; //页码
  public authedPageNum: any; //页码
  public maxSize: number = 5;
  public totalPages: any;  //总页数
  public authedTotalPages: any;
  public size: any; // 当前页容量
  public authedSize: any; // 当前页容量
  private totalItems: number;   //总数据条数
  private authedTotalItems: number;   //总数据条数
  public menuId: any; // 菜单id值
  public button: any = {};// 按钮对象
  public emptyMessage: string = '未查到相关数据'; //primeng dataTable没有数据时，显示的内容

  constructor(private enterpriseAdminService: EnterpriseAdminService,
    private activatedRoute: ActivatedRoute,
    private router: ActivatedRoute,
    private route: Router,
    public commonService: CommonService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonRequestService: CommonRequestService) {
  }

  ngOnInit(): void {
    this.menuId = this.router.snapshot.queryParams['id'] ? this.router.snapshot.queryParams['id'] : this.router.snapshot.params['id'];

    this.pageNum = 1;
    this.pageSize = '10';
    this.authedPageNum = 1;
    this.authedPageSize = '10';
    this.getAppList();
    this.getBtn();

  }

  /**
   * 初始化企业列表数据
   * 待审核列表
   */
  getAuthEnpList() {
    let that = this;
    //待审核列表
    this.enterpriseAdminService.getEnpAuthList(this.appCode, this.appId, this.pageNum, this.pageSize, '0',
    that, result => {
        that.enterpriseAuth = result["rows"];
        that.totalItems = Number(result["totalElements"]);
        that.size = Number(result['size']);
        that.totalPages = Number(result['totalPages']);

      });
  }

  /**
    * 获取初始化按钮数据
    */
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
        if (res.success == 1) {
          _that.button = _that.commonService.viewBtn(res.rows);
        } else if (res.success == -1) {
        }
      }
    );

  }
  /*以审核数据里列表
   *获取已审核数据
   */
  getAuthedEnpList() {
    let that = this;
    this.enterpriseAdminService.getEnpAuthList(this.appCode, this.appId, this.authedPageNum, this.authedPageSize, '-1,1',
    that, enterpriseAuth => {
        that.enterpriseAuthedList = enterpriseAuth["rows"];
        that.conversionApproveResult(that.enterpriseAuthedList); //审核结果转换
        that.authedTotalItems = Number(enterpriseAuth["totalElements"]);
        that.authedSize = Number(enterpriseAuth['size']);
        that.authedTotalPages = Number(enterpriseAuth['totalPages']);

      });
  }

  /*审核结果转换,由数字转换成汉字
   * */
  conversionApproveResult(authedList: EnterpriseAuditInfo[]) {
    for (let i = 0; i < authedList.length; i++) {
      let item = authedList[i];
      switch (item.approveResult) {
        case -1:
        case "-1":
          item.approveResult = "驳回";
          break;
        case 1:
        case "1":
          item.approveResult = "通过";
          break;
        default:
          item.approveResult = "未知";
          break;
      }
    }
  }


  /**
   * 获取应用列表
   * 用于应用按钮显示
   */
  public getAppList() {
    let that = this;
    let params = {
      'appType': 2,
      'pageNum': -1,
    }
    this.enterpriseAdminService.getAppNameList(params, that, res => {
      if (res.success == 1) {
        that.appList = res.rows;
        //企业列表默认为第一个应用下的
        that.appCode = that.appList[0].appCode;
        that.appId = that.appList[0].objectId;
        //设置默认选择第一个应用显示
        that.selectId = that.appList[0].objectId;
        that.getAuthEnpList();
        that.getAuthedEnpList();
      } else if (res.success == -1) {

      }
    });
  }

  /**
   * 获取应用下的企业审核列表
   * @param value 被选中应用的信息
   */
  public getAppEnpList(value) {
    this.appId = value.objectId;
    this.appCode = value.appCode;
    this.selectId = value.objectId;
    this.getAuthEnpList();
    this.getAuthedEnpList();
  }

  // 输入企业名称搜索
  // search(itemsPerPage: number | string, searchtext: string, currentpage: number | string): void {
  //   this.enterpriseAdminService.searchAuthMes(currentpage, itemsPerPage, searchtext)
  //     .then(
  //       enterpriseAuth => {
  //         this.enterpriseAuth = enterpriseAuth["rows"];
  //         this.totalItems = enterpriseAuth["totalElements"];
  //       })
  // }

  /**
   * 翻页 未审核列表
   *
   */
  paginate(event: any) {
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    this.getAuthEnpList();

  }

  /**
   * 页容量改变 未审核列表
   */
  sizeChanged($event) {
    // console.log($event);
    this.pageSize = $event;
    this.pageNum = 1; //页容量改变时，页码值为1
    this.getAuthEnpList();
  }

  /**
   * 翻页 已审核列表
   *
   */
  authedPaginate(event: any) {
    this.authedPageNum = event.currentPage;
    this.authedPageSize = event.itemsPerPage;
    this.getAuthedEnpList();

  }

  /**
   * 已审核 页容量改变时
   * @param event  页容量
   */
  authedSizeChanged($event) {
    this.authedPageSize = $event;
    this.authedPageNum = 1; //页容量改变时，页码值为1
    this.getAuthedEnpList();
  }

  toAuth(car) {
    let obj = {
      objectId: car.objectId,
      enterpriseId: car.businessId,
      startUserName: car.startUserName,
      startTime: car.startTime,
      startUserId: car.startUserId
    }

    let parentPath = this.activatedRoute.parent.routeConfig.path;
    let secondParentPath = this.activatedRoute.parent.parent.routeConfig.path;
    let thirdParentPath = this.activatedRoute.parent.parent.parent.routeConfig.path;
    let fourthParentPath = this.activatedRoute.parent.parent.parent.parent.routeConfig.path;
    let fifthParentPath = this.activatedRoute.parent.parent.parent.parent.parent.routeConfig.path;
    let sixthParentPath = this.activatedRoute.parent.parent.parent.parent.parent.parent.routeConfig.path;
    let seventhParentPath = this.activatedRoute.parent.parent.parent.parent.parent.parent.parent.routeConfig.path;

    this.route.navigate([`/${seventhParentPath}/${sixthParentPath}/${fourthParentPath}/${secondParentPath}/auth-approve`, obj]);
  }

  /*
   * 已审核列表中详情按钮处理方法
   * @param: record:一条记录
   * */
  toAuthedDetails(record: any) {
    let parentPath = this.activatedRoute.parent.routeConfig.path;
    let secondParentPath = this.activatedRoute.parent.parent.routeConfig.path;
    let thirdParentPath = this.activatedRoute.parent.parent.parent.routeConfig.path;
    let fourthParentPath = this.activatedRoute.parent.parent.parent.parent.routeConfig.path;
    let fifthParentPath = this.activatedRoute.parent.parent.parent.parent.parent.routeConfig.path;
    let sixthParentPath = this.activatedRoute.parent.parent.parent.parent.parent.parent.routeConfig.path;
    let seventhParentPath = this.activatedRoute.parent.parent.parent.parent.parent.parent.parent.routeConfig.path;
    this.route.navigate([`/${seventhParentPath}/${sixthParentPath}/${fourthParentPath}/${secondParentPath}/authed`,
    { id: record.objectId, }]);
  }

  /**
   * 操作成功之后的提示
   * @param rel 结果是否成功
   * @param msg 提示信息
   */
  public growl(rel: string, msg: string) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: msg })
  }
}

