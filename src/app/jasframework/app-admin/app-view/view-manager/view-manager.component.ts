import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ContentChildren, Inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, Message, SharedModule, TreeNode } from 'primeng/primeng';

import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { CommonService } from './../../../../core/common-service/common.service';
import { SelectItem } from 'primeng/primeng';
import { disableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'view-manage',
  styleUrls: ['./view-manage.component.css'],
  templateUrl: './view-manage.component.html',
  providers: [ConfirmationService, CommonRequestService, CommonService, CommonRequestMethodService]
})
export class ViewManagerComponent implements OnInit {
  appObj = JSON.parse(localStorage.getItem('appObj'));
  button = {};
  menuId: any;
  //视图类型属性
  viewType = {
    typeName: '',
    typeCode: '',
    appId: this.appObj['appId'],
    appCode: this.appObj['appCode'],
    description: '',
    remark: ''
  }
  public dropdownIsShow: boolean = false;         // 父级视图下拉框是否显示
  public FuncdropdownIsShow: boolean = false;     // 关联功能的下拉框是否显示
  // private functionBoolean = false;             // 添加视图中,关联功能下拉框显示关闭开关
  public viewCodeIsExist: boolean = false;        // 检查'视图编码'是否已经存在
  public viewTypeCodeIsExist: boolean = false;    // 检查'视图类型编码'是否已经存在
  private parentViewIsShow: boolean = true;       // 编辑视图时, 父级视图选项是否可以编辑, 顶级视图父级视图不可编辑
  public selectedFile: any;                       // 被选中的treeTable的节点

  codeHint: boolean;
  private typelist: string[] = [];  // 视图类型列表
  private viewList = [];            // 视图列表
  private viewListShow = [];        // 视图显示列表
  private viewTypeId: string;       // 视图类型ID, 用于查询视图数据,视图编码是否存在参数


  msgs: Message[] = [];             // 操作成功提示
  nodes = [];                       // 父级视图
  funcTree = [];                    // 关联功能
  options = { displayField: 'text', idField: 'uuid' }
  private addView = {               //添加视图时需要的数据
    parentId: '',
    viewFuncName: '',             //视图名称
    viewFuncType: '',             //视图类型: 1 ->菜单, 2->按钮
    opened: '',                   //opened: 0 ->否, 2 ->是
    viewFuncCode: '',             //视图Code
    icon: '',                     //图标
    description: '',              //视图描述
    remark: '',                   //备注
    handler: '',                 //按钮处理函数
    viewTypeId: '',               //视图类型ID
    appId: this.appObj['appId'],
    funcId: '',
    url: '',
  }
  editViewData = {
    objectId: '',          //视图ID
    parentId: '',          //父级视图ID
    viewFuncName: '',      //视图名称
    viewFuncType: '',      //视图类型: 1 ->菜单, 2->按钮
    opened: '',            //是否开放 0 ->否, 2 ->是
    viewFuncCode: '',      //视图编码
    funcId: '',            //关联功能ID
    icon: '',              //图标样式
    handler: '',
    url: '',
    description: '',
    remark: '',
  }
  editParentName: string;   //编辑视图中,父级视图名称
  editFunctionName: string;  //编辑视图中,关联功能名称
  parentName: string;  //父级视图
  functionName: string; //关联功能

  constructor(@Inject('view') private viewService,
              private confirmationService: ConfirmationService,
              private commonRequestService: CommonRequestService,
              private commonService: CommonService,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.menuId = this.route.snapshot.queryParams['id'];
    this.getBtn();      //获得按钮权限
    this.getViewTypeList(); //获得 视图类型列表的数据,在这里获取视图列表数据
  }

  /* 获得视图类型列表数据
   * */
  getViewTypeList() {
    this.viewService.getViewList(this.appObj['appId']).then(res => {
      if (res['rows'].length == 0) {
        this.typelist = [...res['rows']];
        this.viewList = [];
        return false;
      } else {
        this.viewTypeId = res['rows'][0]['objectId']; //获取视图类型ID
        this.addView.viewTypeId = this.viewTypeId;
        this.typelist = [...res['rows']];
        this.getViewData(this.viewTypeId);     //获取视图列表数据
        this.getFuntionTree();  //获取 关联功能
        this.getParentTree();   //获取父级视图数据
      }

    });
  }

  // 获取父级视图列表
  getParentTree(edit?: boolean, id?: any) {
    this.viewService.getViewData(this.viewTypeId, this.appObj['appId']).then(res => {
      this.nodes = [...res['rows']];
      // 处理父级视图中顶级节点，
      this.processParentViewData();
      if (edit) {
        this.commonService.removeChidNode(this.nodes, id);
      }
    });
  }

  // 处理父级视图数据：把顶级节点删除，同时把在首元素上添加一个'无'节点，这个无当做顶级节点
  public processParentViewData() {
    let parentID = null;
    if (this.nodes && this.nodes[0] && this.nodes[0].children) {
      parentID = this.nodes[0].id;
      this.nodes = this.nodes[0].children;
      // 向数组的头部添加一个元素，这个元素代替顶级父节点
      this.nodes.unshift({
        text: '无',
        state: "open",
        checked: false,
        parent: undefined,
        children: [],
        id: parentID
      });
    }
  }

  // 获得关联功能列表数据
  getFuntionTree() {
    this.viewService.getfunctionTree(this.appObj['appCode']).then(res => {
      this.funcTree = [...res['rows']];
      if (this.funcTree && this.funcTree[0] && this.funcTree[0].children) {
        this.funcTree = this.funcTree[0].children;
        this.funcTree.unshift({
          text: '无',
          state: "closed",
          checked: false,
          parent: undefined,
          children: [],
          id: null,
        });
      }
    });
  }

  // 获取视图类型 下 的视图列表数据
  /*查询视图数据
   * @param viewTypeId 视图类型ID
   * */
  getViewData(viewTypeId) {
    this.viewService.getViewData(viewTypeId, this.appObj['appId']).then(res => {
      this.viewList = [...res['rows']];
      this.changeData(this.viewList); //对数据进行处理
      // 根据需求，去掉查询的根节点
      if (this.viewList[0] && this.viewList[0].children) {
        this.viewListShow = this.viewList[0].children;
      }
    });
  }

  //处理视图数据数据格式,把需要的数据留下,其他的删除
  changeData(arr) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var name = item['text'];
      var children = item['children'];
      var att = item['attributes'];
      var checked = item['checked'];
      var opened = att['opened'];
      var id = item['id'];
      if (opened) {
        opened = '否';
      } else {
        opened = '是';
      }
      if (att['viewFuncType'] == 1) {
        var viewFuncType = '菜单';
      } else if (att['viewFuncType'] == 2) {
        var viewFuncType = '按钮';
      } else if (att['viewFuncType'] == 3) {
        var viewFuncType = '其他';
      } else {
        var viewFuncType = '未知情况';
      }

      if (children) {
        var datas = {
          'data': {
            id: id,
            name: name,
            code: att['viewFuncCode'],
            opened: opened,
            times: att['createTime'],
            type: viewFuncType,
            funcName: att['funcName'],
            viewFuncCode: att['viewFuncCode']
          },
          'children': children,
          'attributes': att,
          'checked': checked,
          'id': id,               //用于编辑时显示父级视图ID校验
          'text': item['text'],   //用于编辑时显示父级视图名称
          'expanded': true
        }
        arr[i] = datas;
        if (children.length >= 1) {
          this.changeData(children);
        }
      }
    }
  }

  @ViewChild('viewForm') viewForm; //获得添加视图弹窗表单
  /* 重置添加视图弹窗表单数据
   * @param model 视图html模块
   * */
  resetViewFormDate(model) {
    this.viewCodeIsExist = false; //视图编码检测重置
    this.dropdownIsShow = false;  //父级视图下拉框关闭
    this.FuncdropdownIsShow = false  //添加视图中 关联功能下拉框关闭
    this.viewForm.reset();        //只会重置表单填写的数据,不会终止本来就有的数据
    model.hide();
  }

  @ViewChild('typeForm') typeForm; //获得添加视图类型弹窗表单
  /* 重置添加视图类型弹窗表单数据
   * @param model 视图类型html模块
   * */
  resetViewTypeFormDate(model) {
    this.viewTypeCodeIsExist = false; //视图类型编码检测重置
    this.typeForm.reset();
    model.hide();
  }

  /* 获取列表数据
   * @param car 视图数据
   * */
  editViewBtn(car) {
    this.getFuntionTree();
    this.getParentTree(true, car['id']);
    this.dropdownIsShow = false;    //父级视图下拉框关闭
    this.FuncdropdownIsShow = false;  //关联功能下拉框关闭
    //如果是顶级视图,则编辑选项中, 父级视图选项隐藏。
    if (this.viewList[0].data.name && car['data']['name'] == this.viewList[0].data.name) {
      this.parentViewIsShow = false;
    } else {
      this.parentViewIsShow = true;
    }
    this.editViewData.viewFuncName = car['data']['name'];
    this.editViewData.viewFuncCode = car['data']['code'];
    this.editViewData.objectId = car['id'];
    this.editViewData.handler = car.attributes.handler;
    this.editViewData.icon = car.attributes.icon;
    if (car.attributes.funcId == this.funcTree[0].id || car.attributes.funcId == null) {
      // 如果是根节点 或者 不存在，
      this.editFunctionName = null;                               // 获取关联功能名称
      this.editViewData.funcId = null;                            // 关联功能ID
    } else {
      this.editFunctionName = car.attributes.funcName;            // 获取关联功能名称
      this.editViewData.funcId = car.attributes.funcId;           // 关联功能ID
    }
    this.editViewData.description = car.attributes.description;   // 描述
    this.editViewData.remark = car.attributes.remark;             // 关联功能ID
    this.editViewData.parentId = car.attributes.parentId;         // 父级视图ID
    this.editViewData.url = car.attributes.url;                   // 父级视图ID
    if (car['attributes']['parentId']) {
      this.editViewData.parentId = car['attributes']['parentId'];
    } else {
      this.editViewData.parentId = '';
    }
    if (car['parent'] && car.parent.data) {
      this.editParentName = car['parent']['data']['name'];
    } else if (undefined == car['parent']) {
      // 如果父ID是空，则说明父节点是 顶级节点，
      this.editParentName = '无';
    } else {
      this.editParentName = '';
    }
    // 类型
    if (car.attributes.viewFuncType) {
      this.editViewData.viewFuncType = car.attributes.viewFuncType.toString();
    } else {
      this.editViewData.viewFuncType = '';
    }
    // 是否开放 opened
    if (car['data']['opened'] == '是') {
      this.editViewData.opened = '0';
    } else if (car['data']['opened'] == '否') {
      this.editViewData.opened = '1';
    } else {
      this.editViewData.opened = '';
    }
    // this.getViewBasiciInfo(car['id'], car);
  }

  // 编辑视图中 父级视图下拉框选择处理方法
  editSelectParent(event) {
    this.editParentName = event.node.data.text;
    this.editViewData.parentId = event.node.data.id;
    this.dropdownIsShow = false;    //父级视图下拉框关闭
  }

  // 编辑视图中 关联功能下拉框选择处理方法
  editSelectNode(event) {
    this.editFunctionName = event.node.data.text;
    this.editViewData.funcId = event.node.data.id;
    this.FuncdropdownIsShow = false;
  }

  // 编辑后保存修改的视图
  editViewDataBtn() {
    let data = {
      objectId: this.editViewData.objectId,
      parentId: this.editViewData.parentId,          //父级视图ID
      viewFuncName: this.editViewData.viewFuncName,      //视图名称
      viewFuncType: this.editViewData.viewFuncType,      //视图类型: 1 ->菜单, 2->按钮
      opened: this.editViewData.opened,            //是否开放 0 ->否, 2 ->是
      viewFuncCode: this.editViewData.viewFuncCode,      //视图编码
      funcId: this.editViewData.funcId,            //关联功能ID
      icon: this.editViewData.icon,              //图标样式
      handler: this.editViewData.handler,
      url: this.editViewData.url,
      description: this.editViewData.description,
      remark: this.editViewData.remark,
    }
    this.viewService.putViewData(data).then(res => {
      this.getViewData(this.viewTypeId);
      this.getParentTree();
    });
  }

  filterNodes(text, tree) {
    tree.treeModel.filterNodes(text);
  }

  selectNode(event) {
    this.functionName = event.node.data.text;
    this.addView.funcId = event.node.data.id;
    this.FuncdropdownIsShow = false;
  }

  // 选择一个父级视图
  selectParent(event) {
    this.parentName = event.node.data.text;
    this.addView.parentId = event.node.data.id;
    // this.parentBoolean = false;
    this.dropdownIsShow = false; //关闭下拉框
  }

  // 视图类型列表方法
  onSubmit(typeModal) {
    this.viewService.addViewList(this.viewType).then((res) => {
      if (res['success'] == 1) {
        this.getViewTypeList();
        this.viewType = {
          typeName: '',
          typeCode: '',
          appId: this.appObj['appId'],
          appCode: this.appObj['appCode'],
          description: '',
          remark: ''
        }
        this.codeHint = false;
        this.growl('success', '添加视图类型成功');
        typeModal.hide();
      } else {
        this.growl('error', res['msg']);
      }
    });//添加视图类型
  }


  // 删除一个视图类型
  deleteViewType(viewTypeDate) {
    this.confirmationService.confirm({
      message: '确认删除吗？',
      accept: () => {
        let objectId = { "objectId": viewTypeDate.objectId, };
        this.viewService.deleteViewList(objectId).then((res) => {
          if (res['success'] == 1) {
            this.growl('success', '删除成功');
            this.getViewTypeList();
          } else {
            this.growl('error', res['msg']);
          }
        })
      },

    })
  }


  // 视图类型切换, 视图数据相应切换
  navTable(type) {
    this.viewTypeId = type['objectId']; //获取视图类型ID
    this.addView.viewTypeId = this.viewTypeId;
    this.getViewData(this.viewTypeId); //刷新视图数据
  }


  /* 添加视图按钮确认方法
   * */
  addViewData(addModal) {
    this.viewService.addView(this.addView).then(res => {
      if (res['success'] == 1) {
        this.getViewData(this.viewTypeId);
        // this.getParentTree();
        this.viewForm.reset(); //addview数据重置
        this.growl('success', '添加视图成功');
        addModal.hide();
      } else {
        this.growl('error', res['msg']);
      }
    });
  }


  /* 删除视图按钮处理方法
   * @param viewDate  一条视图数据
   * */
  deleteViewBtn(viewDate) {
    // this.confirmationService.confirm({
    //   message: '确认删除吗？',
    //   accept: () => {
    //     this.editViewData.objectId = viewDate.id;  //作用未知
    //
    //   },
    // })

    this.viewService.deleteViewData(viewDate.id).then(res => {
      if (res['success'] == 1) {
        this.getViewData(this.viewTypeId);
        this.getParentTree();
        this.growl('success', '删除视图成功');
      } else {
        this.growl('error', res['msg']);
      }
    })
  }

  // 获取按钮类型
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
        if (res.success == 1) {
          _that.button = _that.commonService.viewBtn(res.rows);
        } else if (res.success == -1) {
        }
      }
    )
  }

  public loginTimeOut() {
    this.confirmationService.confirm({
      message: '登录超时，请重新登录',
      accept: () => {
        this.router.navigate(['./login']);
        window.localStorage.clear();
      },
      reject: () => {
        this.router.navigate(['./login']);
        window.localStorage.clear();
      }

    })
  }

  // 检查视图code名字是否已经存在了,保证code唯一性
  checkViewCode(viewCode: any) {
    if (!viewCode) {
      this.viewCodeIsExist = false;
      return
    }
    this.viewService.checkCode(viewCode, this.viewTypeId).then(
      (res) => {
        if (res['success'] == 1 && res['rows']) {
          let rel = res['rows'][0];
          if (rel['isExist']) {
            this.viewCodeIsExist = true;
            return;
          }
          else if (!rel['isExist']) {
            this.viewCodeIsExist = false;
          }
        }
      }
    )
  }

  // 检查视图类型code名字是否已经存在了,保证视图类型code唯一性
  checkViewTyepCode(viewTypeCode: any) {
    if (!viewTypeCode) {
      this.viewTypeCodeIsExist = false;
      return
    }
    this.viewService.checkViewTypeCode(viewTypeCode, this.appObj['appId']).then(
      (res) => {
        if (res['success'] == 1 && res['rows']) {
          let rel = res['rows'][0];
          if (rel['isExist']) {
            this.viewTypeCodeIsExist = true;
            return;
          }
          else if (!rel['isExist']) {
            this.viewTypeCodeIsExist = false;
          }
        }
      }
    )
  }

  /**
   * 新建视图弹出按钮处理方法
   */
  public addViewShow(modal: any, promptCreateView) {
    this.viewService.getViewData(this.viewTypeId, this.appObj.appId).then(res => {
      this.nodes = [...res['rows']];
      // 处理父级视图中顶级节点问题，删除顶级几点，在数组首元素上添加一个'无'元素。
      this.processParentViewData();
      if (this.nodes.length == 0) {
        promptCreateView.show(); // 如果父级列表为空,则提示要先创建一个类型视图
      } else {
        modal.show();
        // 如果在列表中选中了一个视图，那么创建的时候就会选中这个视图
        if (this.selectedFile && this.selectedFile.data) {
          this.parentName = this.selectedFile.data.name;      // 选择选中的视图命令
          this.addView.parentId = this.selectedFile.data.id;  // 选择选中的视图ID
        } else {
          this.parentName = this.nodes[0].text;               // 没有选中则默认选择第一个视图名字
          this.addView.parentId = this.nodes[0].id;           // 没有哦选中默认选择第一个视图ID
        }
        this.addView.opened = '1';
        this.addView.viewFuncType = '1';
      }
    });
  }

  /**
   * 提示信息
   * @param rel:结果
   *          'success' :成功
   *          'error'   :失败,错误
   * @param msg:显示信息
   */
  public growl(rel: any, msg: any) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: msg })
  }

}
