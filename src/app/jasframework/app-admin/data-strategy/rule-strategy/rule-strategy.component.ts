import { ActivatedRoute } from '@angular/router';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { FormsModule } from '@angular/forms';
import { AppAdminService } from './../../shared/app-admin.service';
import { DataStrategyService } from './../shared/data-strategy.service';
import { ConfirmationService } from 'primeng/primeng';
import { CommonService } from './../../../../core/common-service/common.service';
import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
declare var $: any; // 引用juery

@Component({
  selector: 'rule-strategy',
  templateUrl: './rule-strategy.component.html',
  styleUrls: ['./rule-strategy.component.scss']
})
export class RuleStrategyComponent implements OnInit, AfterViewChecked {
  public fusionListData: any;  // 融合策略列表
  public appInfo: any = JSON.parse(window.localStorage['appObj'])
  public resourceTreeData: any; // 资源列表
  public checkedList: any = []; // 选中的资源列表
  public strategyFormData: any = {}; // 资源的表单数据
  public modalName: any; // 弹窗名字
  public confirmFooterBtn: any = true; // 控制 提示框的 footer中 取消按钮的显隐,默认显示
  public ruleConfim: any = true;  //规则名称选择是否合适的 提示
  public logicValueConfirm: any = true;  // 逻辑关系是否选择 提示
  public indexRule: any; // 控制 不同的规则详细信息  显示
  public successMsg: any; // 成功提示信息
  public selectedResourceFile: any = {} // 左侧选中的节点值
  public priorityList: any; // 优先级策略列表
  public priorityParams: any = {}; // 优先级策略获取列表参数
  public fusionParams: any = { dataresourceId: '', isGlobal: true, appId: this.appInfo.appId }; // 融合策略获取列表参数
  public ruleModalList: any; // 弹窗的列表
  public checkedRuleNames: any = '';  // 选中的规则名称
  public checkedRuleIds: any = '';  // 选中的规则id
  public errorMsg: any; // 弹窗的错误提示信息
  public emptyMessage: string = '未查到相关数据';

  // 分页参数
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: string = '10'; //页容量
  public pageNum: any = 1; //页码
  public maxSize: number = 5;
  public totalPages: any;  //总页数
  public size: any; // 当前页容量
  private totalItems: any; //总数据条数
  public menuId: any; // 菜单的id
  public button: any;  // 菜单集合
  @ViewChild('viewModal') viewModal: any; // 添加和修改 弹窗
  @ViewChild('Modal') modal: any; // 弹窗
  @ViewChild('modalForm') modalForm: any; // 添加和修改资源的form表单
  @ViewChild('childModal') childModal: any; // 提示弹窗
  constructor(
    public commonService: CommonService,
    public confirmationService: ConfirmationService,
    public dataStrategyService: DataStrategyService,
    public appAdminService: AppAdminService,
    public commonRequestService: CommonRequestService,
    public router: ActivatedRoute
  ) {
    this.resourceTreeData = [{
      label: '全局',
      id: 'node-all',
      expanded: true,
      children: []
    }, {
      label: '资源',
      id: 'node-resource',
      expanded: true,
      children: []
    }];
  }

  ngOnInit() {
    this.menuId = this.router.snapshot.queryParams['id'] ? this.router.snapshot.queryParams['id'] : this.router.snapshot.params['id'];
    // 获取 资源数据
    // 发请求获取 资源数据
    this.getResourceListData();

    // 获取融合策略列表
    this.getFusionList();
    // 获取 指定资源的规则列表
    this.getRuleListById();
    // 获取优先级策略列表
    this.getPriorityList();
    this.getBtn();
  }

  // 每一次组件视图中检测后执行
  ngAfterViewChecked() {
    // 设置资源树的  节点状态
    if (this.selectedResourceFile && !this.selectedResourceFile['id']) {
      $('#node-all').parent().parent().parent().addClass('ui-state-highlight');
    } else {
      $('#node-all').parent().parent().parent().removeClass('ui-state-highlight');
    }
    $(".node-resource-tree").parent().parent().removeClass();
    $(".node-resource-tree").parent().parent().click((event) => {
      event.stopPropagation();
      return;
    })
    $(".node-resource-tree").parent().parent().parent().css('cursor', 'default');
    $(".node-resource-children").parent().parent().parent().css({ 'height': '30px', 'line-height': '30px' });
  }

  /**
   * 获取资源的列表数据
   * 请后台发送请求，得到 左侧资源树的 数据
   * @memberof ResourceAdminComponent
   */
  getResourceListData() {
    let params = {
      appId: this.appInfo.appId
    };
    let __this = this;
    this.appAdminService.getResList(params, __this, (res) => {
      if (res && res.success == 1) {
        this.resourceTreeData[1].children = this.appAdminService.changeDropDownData(res.rows, [])[0].children;
      }
    })
  }
  /**
   * 获取按钮集合的值
   * 
   * @memberof DataResourceComponent
  * */
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(_that.menuId, _that, (res) => {
      if (res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
      }
    });
  };

  /**
   * 选中左侧的资源树
   * 用户点击左侧的资源树，获取选中的资源id，并请求融合策略、优先级策略及指定资源的规则列表
   * @returns 
   * @memberof RuleStrategyComponent
   */
  public resouceSelect() {
    // 如果点击的是  父节点，直接返回，不继续执行。
    if (this.selectedResourceFile && this.selectedResourceFile.children && this.selectedResourceFile.children.length > 0) return;
    // 当用户点击 资源 的节点，返回
    if (this.selectedResourceFile.id === 'node-resource') {
      return;
    }
    // 初始化 提示信息的列表内容
    this.successMsg = [];
    if (this.selectedResourceFile.id === 'node-all') {
      // 选中全局资源
      this.priorityParams = {};  // 优先级
      this.fusionParams = {
        dataresourceId: '',
        isGlobal: true,
        appId: this.appInfo.appId
      };
    } else {
      // 选中具体资源的id
      this.priorityParams = {
        dataresourceId: this.selectedResourceFile.id
      };
      this.fusionParams = {
        dataresourceId: this.selectedResourceFile.id,
        isGlobal: false,
        appId: this.appInfo.appId
      };
    }


    // 获取 指定资源 融合策略列表
    this.getFusionList();
    // 获取 指定资源 的规则列表
    this.getRuleListById();
    // 获取优先级策略列表
    this.getPriorityList();
  }


  /**
   * 获取 融合策略列表
   * 
   * @memberof RuleStrategyComponent
   */
  getFusionList() {
    let _that = this;
    this.dataStrategyService.getFusionlistReq(this.fusionParams, _that, (res) => {
      if (res && res.success && res.success == 1) {
        this.fusionListData = res.rows;
        _that.totalItems = res["totalElements"];
        _that.size = res['size'];
        _that.totalPages = res['totalPages'];
        this.successMsg.push({ severity: 'success', summary: '', detail: '融合策略刷新成功' })
      } else {
        this.successMsg.push({ severity: 'error', summary: '', detail: res.ms })
      }
      this.commonService.growl(_that, '', '', this.successMsg);
    })
  }
  /**
    * 获取优先级策略的 列表
    * 请后台发送请求，得到 优先级策略的列表数据
    * @memberof RuleStrategyComponent
    */
  getPriorityList() {
    let __this = this;
    this.successMsg = [];
    this.priorityParams['appId'] = this.appInfo.appId;
    this.dataStrategyService.getPriority(this.priorityParams, __this, (res) => {
      if (res && res.success && res.success == 1) {
        this.priorityList = res.rows;
        this.successMsg.push({ severity: 'success', summary: '', detail: '优先级策略刷新成功' })
      } else {
        this.successMsg.push({ severity: 'error', summary: '', detail: res.msg })
      }
      this.commonService.growl(__this, '', '', this.successMsg);
    })
  }

  /**
   * 获取融合策略的信息
   * 
   * @memberof RuleStrategyComponent
   */
  getFusionInfo(row) {
    let _that = this;
    let params = {
      objectId: row.objectId
    };
    this.dataStrategyService.viewStrategyReq(params, _that, (res) => {
      if (res && res.success && res.success == 1) {
        this.strategyFormData = res.rows ? res.rows[0] : {};
      }
    })
  }

  /**
   * 获取指定资源的规则列表
   * 通过资源id获取
   * @memberof RuleStrategyComponent
   */
  getRuleListById() {
    let _that = this;
    let params = {
      dataresourceId: this.fusionParams['dataresourceId'],
      appId: this.appInfo.appId,
      isGlobal: this.fusionParams['isGlobal'],
    }
    this.dataStrategyService.getRuleListData(params, _that, (res) => {
      if (res && res.success && res.success == 1) {
        this.ruleModalList = res.rows;
      }
    })
  }





  /**
   * 弹窗 弹出
   * 
   * @param {string} modalCategory 弹窗类型 值： view/add/edit
   * @param {*} [data] 弹窗中表单数据，可传可不传
   * @memberof RuleStrategyComponent
   */
  modalShow(modalCategory: string, data?: any) {
    // 清空 之前内容
    this.ruleConfim = true;  // 默认 提示规则数量的 不显示
    this.checkedList = [];  // checkList为空;

    if (modalCategory == 'view') {
      this.viewModal.show();
      this.strategyFormData = data;
      return;
    }

    // 重置表单信息
    this.strategyFormData = {};
    // 设置 逻辑关系的 默认值 
    this.strategyFormData.logicValue = 'or';
    // 弹窗 弹出
    this.modal.show();
    let checkObj = { checked: false };
    // 已经融合的规则 添加选中状态
    let ruleIdArr = modalCategory != 'add' ? data.ruleIds.split(',') : [];
    for (let i = 0; i < this.ruleModalList.length; i++) {
      let item = this.ruleModalList[i];
      if (modalCategory != 'add') {  // 编辑融合策略
        checkObj.checked = false;
        for (let selectedRule of ruleIdArr) {
          if (selectedRule == item.ruleId) {
            checkObj.checked = true;
            item['checked'] == true;
          }
          Object.assign(item, checkObj);
        }
      } else {   // 添加融合策略
        Object.assign(item, checkObj);
      }
    }
    // 判断不同的弹窗页面
    if (modalCategory == 'add') {
      this.modalName = '添加';
    } else {
      this.modalName = '编辑';
      this.getFusionInfo(data);
    }
    // 阻止浏览器默认右键点击事件
    $('.rule-icon').bind("contextmenu", function () {
      return false;
    })
    $('.rule-icon').mousedown(function (e) {
      if (3 == e.which) {
        this.indexRule = this.className.slice(-1, this.className.length);
      }
    })
    // this.indexRule = 0;
    // 鼠标离开规则内容区域，提示框消失
    $('.rule-icon').mouseleave(() => {
      this.indexRule = undefined;
    })
    $('.fa-info-circle').mouseenter((e) => {
      let parent = e.currentTarget.parentElement;
      this.indexRule = parent.className.slice(-1, parent.className.length);

    })


  }
  /**
   * 复制 规则内容
   * 点击复制按钮，复制规则中的规则内容
   * @memberof RuleStrategyComponent
   */
  public copyConfirm: any = false; // 复制成功的提示
  copyContent(dom) {
    this.copyConfirm = false;
    let eleDom = dom;
    dom.select();
    document.execCommand("Copy");
    this.copyConfirm = true;
    setTimeout(() => {
      this.copyConfirm = false;
    }, 500)
  }

  /**
   * 生成策略内容
   * 
   * @memberof RuleStrategyComponent
   */

  public createStrategy() {
    // 获取选中的规则
    this.getCheckedList();
    // 判断 选中的规则 数量是否足够，小于2 返回
    if (this.checkedList.length <= 1) {
      this.ruleConfim = false;
      return;
    }
    if (!this.strategyFormData.logicValue) {
      this.logicValueConfirm = false;
      return;
    }
    this.logicValueConfirm = true;
    this.ruleConfim = true;
    let contentStr = '';    // 融合策略内容
    for (let item of this.checkedList) {
      contentStr = contentStr + this.strategyFormData.logicValue + " " + item.content + " ";
    }
    // 判断 策略内容是否为空
    if (this.strategyFormData.content && this.strategyFormData.content.length > 0) {
      // 内容不为空
      this.confirmationService.confirm({
        message: '确定覆盖当前策略内容？',
        accept: () => {
          // 生成策略内容
          this.strategyFormData.content = contentStr.slice(this.strategyFormData.logicValue.length + 1);
        }
      })
    } else {
      // 直接生成策略内容
      this.strategyFormData.content = contentStr.slice(this.strategyFormData.logicValue.length + 1);
    }
  }

  /**
   * 获取选中的规则列表
   * 
   * @memberof RuleStrategyComponent
   */

  getCheckedList() {
    this.checkedList = [];
    let checkedNames = '';
    let checkedIds = '';
    for (let item of this.ruleModalList) {
      if (item.checked) {
        this.checkedList.push(item);
        checkedNames = checkedNames + ',' + item.ruleName;
        checkedIds = checkedIds + ',' + item.ruleId;;
      }
    }
    this.checkedRuleNames = checkedNames.slice(1);
    this.checkedRuleIds = checkedIds.slice(1);
  }


  /**
   * 保存  策略
   * 
   * @memberof RuleStrategyComponent
   */
  addSave(type?: any) {
    this.getCheckedList();
    if (!this.strategyFormData.content || (this.strategyFormData.content && this.strategyFormData.content.length == 0)) {
      this.strategyFormData.contentConfirm = true;
      return;
    }
    // 判断 选中的规则 数量是否足够，小于2 返回
    if (this.checkedList.length <= 1) {
      this.ruleConfim = false;
      return;
    };
    this.ruleConfim = true;
    this.successMsg = [];
    let _that = this;
    let params = type ? this.strategyFormData : this.modalForm.value;
    params['appId'] = this.appInfo.appId;
    params['dataresourceId'] = this.fusionParams['dataresourceId'];
    params.ruleNames = this.checkedRuleNames;
    params.ruleIds = this.checkedRuleIds;
    if (type) {
      // 添加融合策略
      delete params.logicValue;
      delete params.contentConfirm;
      this.dataStrategyService.addStrategyReq(params, _that, (res) => {
        if (res.success && res.success == 1) {
          this.successMsg.push({ severity: 'success', summary: '', detail: '融合策略添加成功', });
          this.getFusionList();
          this.modal.hide();
        } else {
          if (res.code == 'PU06007') {
            _that.errorMsg = "已存在相同规则的融合策略",
              _that.childModal.show();
          }
        }
        this.commonService.growl(_that, 'success', res.msgs, this.successMsg);
      })

    } else {
      params.objectId = this.strategyFormData.objectId;
      delete params.or;
      delete params.and;
      delete params.appId;
      delete params.dataresourceId;
      this.dataStrategyService.updateStrategyReq(params, _that, (res) => {
        if (res.success && res.success == 1) {
          this.successMsg.push({ severity: 'success', summary: '', detail: '融合策略更新 成功', });
          this.getFusionList();
          this.modal.hide();
        } else {
          if (res.code == 'PU06007') {
            this.errorMsg = "已存在相同规则的融合策略",
              this.childModal.show();
          }
        }
        this.commonService.growl(_that, 'success', res.msgs, this.successMsg);
      })

    }
    // 设置逻辑关系的默认值
    this.strategyFormData.logicValue = 'or';
  }




  /**
   * 弹窗 消失
   *
   * @memberof ResourceAdminComponent
   */
  modalHide() {
    this.modal.hide();
  }
  /**
   * 删除融合策略
   * 
   * @param {any} row 删除行的数据
   * @memberof RuleStrategyComponent
   */
  delete(row) {
    let __this = this;
    let data = {
      objectId: row.objectId,
      appId: this.appInfo.appId
    };
    this.successMsg = [];
    this.confirmationService.confirm({
      message: '确定要删除该策略？',
      accept: () => {
        this.dataStrategyService.delStrategyReq(data, __this, (res) => {
          if (res && res.success == 1) {
            __this.getFusionList();

            __this.successMsg.push({ severity: 'success', summary: '', detail: '融合策略删除成功' })

          } else {
            __this.successMsg.push({ severity: 'error', summary: '', detail: '融合策略删除失败' });
          }
          __this.commonService.growl(__this, '', '', __this.successMsg);
        })
      }
    })
  }

  /**
   * 翻页
   * @param event 存放当前页码和页容量
   */
  public paginate(event) {
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    this.getFusionList();
  }

  /**
   * 页容量改变
   * @param event 存放页容量
   */
  public sizeChanged(event) {
    this.pageSize = event;
    this.pageNum = 1; //页容量改变时，页码值为1
    this.getFusionList();
  }
}
