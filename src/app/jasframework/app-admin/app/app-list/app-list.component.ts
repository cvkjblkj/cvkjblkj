import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { Modals } from '../../../../demo/ui/components/modals';
import { objectify } from 'tslint/lib/utils';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { AppAdmin } from '../shared/app.model';
import { NgForm } from '@angular/forms';
import { AppService } from '../shared/app.service';
import { Message } from 'primeng/primeng';
import { CommonRequestService } from './../../../../core/common-service/common-request.service'
import { CommonService } from './../../../../core/common-service/common.service';
@Component({
  selector: ' AppListComponent',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css'],
  providers: [AppService, ConfirmationService, CommonRequestService, CommonService, CommonRequestMethodService]
})
export class AppListComponent implements OnInit {
  public rows: any;
  public appCode: any;//应用标识;
  public appName: any; //应用名称;
  public url: any;//url
  public model = new AppAdmin();
  public message: any; // 操作提示框 内的提示信息
  public msgs: any;//操作提示
  public selectedEnterprise: any; //选中的记录
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: number = 10;
  public pageNum: any;  //当前页码
  public totalItems: string;//总数据条数
  public maxSize: number = 4;
  public totalPages: any; //总页数
  public size: any; // 页码
  public menuId: any;//菜单id
  public button: any = {};//按钮对象
  public status: any;
  public createTime: any;
  public sortF = "createTime";
  public sortO = -1;
  public orderName: any = 'create_time desc';
  public emptyMessage: string = '未查到相关数据'; //primeng dataTable没有数据时，显示的内容
  public isTrue: boolean = true;
  constructor(
    private appService: AppService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    private commonRequestService: CommonRequestService,
    private commonService: CommonService
  ) { }
  @ViewChild('application') application;
  addForm: NgForm;
  @ViewChild('addForm') AddForm: NgForm;
  ngOnInit() {
    this.pageNum = 1;
    this.pageSize = 10;
    if (this.route.snapshot.queryParams) {

      this.menuId = this.route.snapshot.queryParams['id'];
      if (!this.menuId) {
        this.menuId = this.route.snapshot.params['id'];
      }

    }
    this.getList();


  };
  /**
 * 将列表排序
 *
 * @param {any} e
 * @memberof LoginJournalComponent
 */
  changeSort(e) {
    let order;
    let orderField
    if (e.order == 1) {
      order = 'asc';
      // 正序
    } else if (e.order == -1) {
      // 倒序
      order = 'desc';
    }
    if (e.field.match(/[A-Z]/g)) {
      // 有大写
      let upperString = e.field.match(/[A-Z]/g).join(",");
      orderField = e.field.replace(/[A-Z]/g, "_" + upperString.toLowerCase());
    } else {
      // 全部小写
      orderField = e.field;
    }


    this.orderName = orderField + " " + order;
    // this.initLoginListData();
    this.getList();
  }
  /*页面初始化*/
  getList() {
    let _that = this;
    let url = '/user/getManagedAppList';
    let params = {
      pageNum: _that.pageNum,
      pageSize: _that.pageSize,
      orderBy: _that.orderName
    };
    _that.appService.getUser(url, params, _that, function (res) {
      if (res['rows']) {
        _that.rows = res['rows'];
        _that.totalItems = res['totalElements'];
        _that.size = res['size'];
        _that.totalPages = res['totalPages'];
        _that.selectedEnterprise = [];
        _that.growl('success', '页面刷新成功');
      } else if (!res['rows']) {
        _that.isTrue = false;
      }

    })
    _that.getBtn();

  };
  /**
   * menuID
   */
  public getBtn() {
    let _that = this;

    this.commonRequestService.getMenuBtn(_that.menuId, _that, (res) => {
      if (res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
        window.localStorage.setItem('appListBtn', JSON.stringify(_that.button));
      }
    });
  };
  /**
   * 分页
   */
  sizeChanged($event: any) {
    this.pageSize = $event;
    this.pageNum = 1;
    this.getList();
  };
  /**
   * 分页
   * @param event
   */
  paginate(event: any) {
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    this.getList();
  };
  public objectId: any;
  public selectedSystemes: any;
  /*点击弹出框*/
  add(addModal: any) {
    addModal.show();

  };
  /*点击取消，表单重置*/
  hide(addModal: any, addForm: any) {
    addForm.reset();
    addModal.hide();
    this.nameExistRel = true;
    this.codeExistRel = true;
  };

  /**
   * 弹出框
   * @param addModal
   * @param AddForm
   */
  addsave(addModal: any, AddForm: any) {
    let _that = this;
    this.disabled = true;
    let url = '/app/add';
    let params = {
      appCode: _that.model.appCode,
      appName: _that.model.appName,
      url: _that.model.url,
      remark: _that.model.remark,
      description: _that.model.description
    }
    this.appService.addSave(_that, url, params, (res) => {
      if (res['success'] && res['success'] == 1) {
        _that.growl('success', '添加成功');
        AddForm.reset();
        _that.getList();
        _that.disabled = true;
      } else if (res['success'] == -1) {

      }
      addModal.hide();
    })
  };
  /*菜单右显*/
  public appObj: any; //存储localstorage
  public appId: any;//

  /**
   * @param Modal
   * 管理路由跳转
   */
  manager(modal: any) {

    let parentPath = this.route.parent.routeConfig.path;
    let secondParentPath = this.route.parent.parent.routeConfig.path;
    let thirdParentPath = this.route.parent.parent.parent.routeConfig.path;
    let fourthParentPath = this.route.parent.parent.parent.parent.routeConfig.path;
    let fifthParentPath = this.route.parent.parent.parent.parent.parent.routeConfig.path;
    let sixthParentPath = this.route.parent.parent.parent.parent.parent.parent.routeConfig.path;
    let seventhParentPath = this.route.parent.parent.parent.parent.parent.parent.parent.routeConfig.path;
    this.router.navigate([`/${seventhParentPath}/${sixthParentPath}/${fourthParentPath}/${secondParentPath}/info`]);
    /*存储localstorage*/
    this.appObj = {
      appCode: modal.appCode,
      appName: modal.appName,
      appId: modal.objectId
    };
    this.translate();
    /*appObj localstorage传的值*/
    localStorage.setItem('appObj', JSON.stringify(this.appObj));

  };

  /**
   * @param Modal
   * 停止服务
   */
  stop(modal: any) {
    let _that = this;
    let url = '/app/stop';
    this.disabled = true;
    let params = {
      appId: modal.objectId
    };
    this.confirmationService.confirm({
      message: '确定要停止该应用吗？',
      accept: () => {
        this.appService.stop(_that, url, params, (res) => {
          if (res['success'] == 1 && res['rows']) {
            this.growl('success', '已停止该应用');
            this.disabled = false;
            this.getList();
          } else if (res['success'] == -1) {
            this.disabled = false;
          };
        })
      }
    })
  };


  /**
   * @param Modal
   * 启用服务
   */
  start(modal: any) {
    let _that = this;
    let url = '/app/start';
    this.disabled = true;
    let params = {
      appId: modal.objectId
    };
    this.confirmationService.confirm({
      message: '确定要启用该应用吗？',
      accept: () => {
        _that.appService.start(_that, url, params, (res) => {
          if (res['success'] == 1 && res['rows']) {
            this.growl('success', '启用应用成功');
            this.disabled = false;
            this.getList();
          }
        });
      }

    })
  };
  /*菜单右边显示*/
  translate() {
    let targetElement = this.application.nativeElement.offsetParent.offsetParent.children[0].children[0].children[0]
    if (targetElement.className == 'modelRight') {  // 右边菜单 显示时
      targetElement.className = '';
    }
  };
  /*appCode校验*/
  public codeExistRel: boolean = true;
  public codeExistMes: string;
  /*appName校验*/
  public nameExistRel: boolean = true;
  public nameExistMes: string;
  public isEixtShow: boolean = false; /*应用code保存按钮是否可用*/
  public EixtShow: boolean = false; /*应用名称保存按钮是否可用*/
  public disabled: boolean = true;
  /**
   * @param appCode
   * @param appId
   * code验证
   */
  codeIsExist(appCode: any, appId: any) {
    if (!appCode) {

      return;
    }
    let _that = this;
    let url = '/app/checkCode';
    let params = {
      appCode: appCode,
      appId: appId
    }
    _that.appService.checkCode(url, params, _that, function (res) {
      _that.codeExistRel = true;
      if (res['success'] == 1 && res['rows']) {
        let rel = res['rows'][0];
        if (rel['isExist']) {
          _that.isEixtShow = true;

          _that.codeExistRel = false;
          _that.codeExistMes = '应用编码已经存在';
          return;
        } else if (!rel['isExist']) {
          _that.isEixtShow = false;
        }
      }
    });
  };

  /**
   * 应用名称校验
   * @param appName
   * @param appId
   */
  nameIsExist(appName: any, appId: any) {
    this.disabled = true;
    if (!appName) {

      return;
    }
    let _that = this;
    let url = '/app/checkName';
    let params = {
      appName: appName,
      appId: appId
    }
    _that.appService.checkCode(url, params, _that, function (res) {
      _that.nameExistRel = true;

      if (res['success'] == 1 && res['rows']) {
        let rel = res['rows'][0];

        if (rel['isExist']) {

          _that.EixtShow = true;
          _that.nameExistRel = false;
          _that.nameExistMes = '应用名称已经存在';
          return;
        } else if (!rel['isExist']) {
          _that.EixtShow = false;
        }
      }
    })
  };

  public urlMismatch: boolean = false; //正则判断提示
  /**url正则判断
   * @param url
   */
  telephoneCheck(url: any) {
    if (url == '' || url == undefined) {
      this.urlMismatch = false;
      return;
    }
    let reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
    if (reg.test(url.toString())) {
      this.urlMismatch = false;
    } else {
      this.urlMismatch = true;
    };
  };
  public growl(rel: string, res: string) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: res });
  }
};
