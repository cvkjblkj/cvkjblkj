import { ActivatedRoute } from '@angular/router';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { AppAdminService } from '../../shared/app-admin.service';
import { CommonService } from '../../../../core/common-service/common.service';
import { ConfirmationService } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

declare var $: any; // 引入juqery
@Component({
  selector: 'data-resource',
  templateUrl: './data-resource.component.html',
  styleUrls: ['./data-resource.component.scss'],
  providers: [AppAdminService, CommonRequestService]
})
export class DataResourceComponent implements OnInit {
  // 资源树的数据
  public resourceReturndData: any; // 资源请求返回的数据
  // 应用   需要的变量
  public appInfo: any = JSON.parse(window.localStorage['appObj']); // 应用的信息（应用名称、应用code、应用id）
  public appName: any; // 应用名称
  // 弹窗   需要的变量
  public resourceFormData: any = {}; // 资源的表单数据
  public modalName: any; // 弹窗名字
  public dropDownTree: any; // 父级的树 数据
  public selectedFile: any;   // 父级的下拉框数据
  public errorMsg: any; // 错误信息的提示
  // 搜索   需要的变量
  public searchValue: any; // 搜索内容
  public selectName: any; // 下拉框选中的名字
  // 列表   需要的变量
  public resourceListData: any;  // 资源的列表数据
  public emptyMessage = '未查到相关数据';
  public selectedTreeTable: any; // 当前选中的节点
  // primeng 插件 growl 的 提示参数
  public msgs: any; // 成功提示信息
  public successMsg = [];
  public modalResourceListData: any; // 弹窗中资源的数据

  // 按钮需要的变量
  public button: any = {};  // 按钮的集合
  public menuId: any; // 菜单的id
  searchNodeValue: any; // 弹窗中搜索框的值

  @ViewChild('Modal') modal: any; // 弹窗
  @ViewChild('viewModal') viewModal: any; // 弹窗
  @ViewChild('childModal') childModal: any; // 弹窗
  @ViewChild('modalForm') modalForm: any; // 添加和修改资源的form表单


  constructor(
    public appAdminService: AppAdminService,
    public commonService: CommonService,
    private confirmationService: ConfirmationService,
    public commonRequestService: CommonRequestService,
    public router: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.selectName = '资源名称';
    this.getResourceListData();
    this.menuId = this.router.snapshot.queryParams['id'] ? this.router.snapshot.queryParams['id'] : this.router.snapshot.params['id'];
    this.getBtn();
    this.addEnterEvent();
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    $('.search-input').unbind("keypress");
    $('.searchText').unbind("keypress");
  }
  /**
   * 给搜索框添加enter事件
   * 
   * @memberof AppFuncComponent
   */
  addEnterEvent() {
    let _that = this;
    $('.search-input').bind('keypress', function (event) {
      if (event.keyCode == 13 && this == document.activeElement) {
        _that.search();
      }
    })
  }

  /**
   * 弹窗中的搜索按钮
   * 
   * @memberof AppFuncComponent
   */
  nodeModalSearch() {
    this.getResourceListData('search', 'modal');
  }

  /**
   * 弹窗中的 搜索框加enter事件
   * 
   * @memberof AppFuncComponent
   */
  addModalEnterEvent() {
    let _that = this;
    $('.searchText').bind('keypress', function (event) {
      if (event.keyCode == 13 && this == document.activeElement) {
        _that.getResourceListData('search', "modal");
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
  // 阻止冒泡
  stopBubble(e) {
    this.commonService.stopBubble(e);
  }
  /**
   * 获取资源的列表数据
   *
   * @memberof ResourceAdminComponent
   */
  getResourceListData(type?: any, modal?: any) {
    let body = {
      appId: this.appInfo['appId']
    };
    if (this.selectName) {
      body['resourceName'] = this.searchValue ? this.searchValue : '';
    }
    if (type && type == 'search' && modal) {
      body['resourceName'] = this.searchNodeValue ? this.searchNodeValue : '';
    }
    let __this = this;
    this.successMsg = [];
    this.appAdminService.getResList(body, __this, (res) => {
      if (res && res.success == 1) {
        if (type && type == 'search' && modal) {
          // 弹窗的搜索框        
          if (this.searchNodeValue && this.searchNodeValue) {
            // 搜索结果为列表
            this.dropDownTree = this.appAdminService.changeDropDownData(res.rows, []);
          } else if ((this.searchNodeValue && this.searchNodeValue.length == 0) || !this.searchNodeValue) {
            // 没有搜索内容，搜索结果为 全部数据
            if (this.modalName != "添加数据资源") {
              // 编辑 弹窗中搜索结果
              this.dropDownTree = this.appAdminService.changeDropDownData(res.rows, [], this.editRowId)[0].children;
            } else {
              // 添加 弹窗中搜索结果
              this.dropDownTree = this.appAdminService.changeDropDownData(res.rows, [])[0].children;
            }
          }
          return;
        }
        __this.resourceReturndData = res.rows;
        __this.resourceListData = __this.changeData(res.rows, []);
        console.log(__this.searchValue);
        if (!type || !__this.searchValue || (type == 'search' && (__this.searchValue.length == 0 || !__this.searchValue))) {
          // 不是搜索情况
          console.log('------------');
          __this.resourceListData = __this.resourceListData ? __this.resourceListData[0] ? __this.resourceListData[0] ? __this.resourceListData[0].children : [] : [] : [];;
        }
        this.successMsg.push({ severity: 'success', summary: '', detail: '数据资源刷新成功' });
      } else {
        this.successMsg.push({ severity: 'error', summary: '', detail: res.msgs });
      }
      __this.commonService.growl(__this, 'success', res.msgs, this.successMsg);
    })
  }


  /**
   * 保存添加或者修改的资源信息
   *
   * @params {any} form 表单
   * @memberof ResourceAdminComponent
   */

  addSave(category: string) {
    let __this = this;
    let body = category === 'add' ? this.resourceFormData : this.modalForm.value;
    delete body.parentName;
    if (body.parentId == 'nothing') {
      body.parentId = this.modalResourceListData[0].id;
    }
    this.successMsg = [];
    if (category == 'add') {
      this.appAdminService.addResourceReq(body, __this, (res) => {
        if (res && res.success == 1) {
          // 弹窗消失
          this.modalHide();
          this.successMsg.push({ severity: 'success', summary: '', detail: '数据资源添加成功' });
          // 调取列表数据
          this.selectName = '资源名称';
          this.searchValue = '';
          this.getResourceListData();
        } else {
          this.errorMsg = res.msg;
          this.childModal.show();
        }
        __this.commonService.growl(__this, 'success', '数据资源添加成功', this.successMsg);
      })
    } else {
      body.objectId = this.resourceFormData.objectId;
      if (this.selectedFile || this.resourceFormData.parentId) {
        body.parentId = this.resourceFormData.parentId;
      }
      if (body.parentId == 'nothing') {
        body.parentId = this.modalResourceListData[0].id;
      }
      delete body.search;
      this.appAdminService.UpdateResourceReq(body, __this, (res) => {
        if (res && res.success == 1) {
          // 弹窗消失
          this.modalHide();
          this.successMsg.push({ severity: 'success', summary: '', detail: '数据资源修改成功' });
          __this.commonService.growl(__this, 'success', '数据资源修改成功', this.successMsg);
          // 调取列表数据
          this.selectName = '资源名称';
          this.searchValue = '';
          this.selectedTreeTable = {};
          this.getResourceListData();
        } else {

        }
      })
    }
  }


  /**
   * 弹窗 弹出
   *
   * @memberof ResourceAdminComponent
   */
  modalShow(modalCategory: string, row?: any) {
    $('.modal-content').click((event) => {
      let targetDom = event.target;
      if (targetDom.id != 'dropdownTree' && targetDom.parentElement.id != 'dropdownTree') {
        if ($('.dropdowntree').css('display') != 'none') {
          $('.dropdowntree').css('display', 'none')
        }
      }
    })
    this.resourceFormData = {};
    this.getModalResourceTee(modalCategory, row);
    if (modalCategory == 'view') {
      this.modalName = '资源信息';
      this.viewModal.show();
      this.resourceFormData = row;
    } else {
      // 重置表单信息
      this.modalForm.reset();
      this.successMsg = [];
      // 判断不同的弹窗页面
      if (modalCategory == 'add') {
        this.modalName = '添加数据资源';
      } else {
        this.modalName = '编辑数据资源';
        this.editRowId = row.data.id;
        // this.getResourceByIdData(row);
      }
      setTimeout(() => {
        // 弹窗 弹出
        this.modal.show();
      }, 100)

    }

  }
  /**
   * 获取弹窗中资源树数据
   * @param modalCategory 列别
   * @param row 选中项数据
   */
  public editRowId: any;  // 编辑的资源id
  getModalResourceTee(modalCategory, row) {
    let __this = this;
    // 数据资源树
    this.appAdminService.getResList({ appId: this.appInfo['appId'] }, __this, (res) => {
      if (res && res.success == 1) {
        this.modalResourceListData = res.rows;
        if (modalCategory == 'add') {
          // 添加弹窗
          this.resourceFormData.appId = this.appInfo.appId;
          this.resourceFormData.parentName = this.selectedTreeTable ? this.selectedTreeTable.data ? this.selectedTreeTable.data.resourceName : '无' : '无';
          this.resourceFormData.parentId = this.selectedTreeTable ? this.selectedTreeTable.data ? this.selectedTreeTable.data.id : 'nothing' : 'nothing';
          this.dropDownTree = this.appAdminService.changeDropDownData(this.modalResourceListData, [])[0].children;
          this.dropDownTree.unshift({
            label: '无',
            parent: undefined,
            children: [],
            id: 'nothing'
          })
        } else if (modalCategory == 'edit') {
          // 编辑弹窗
          let params = {
            objectId: row.data.id
          };
          let __this = this;
          // 当前 选中列表项的具体数据
          this.appAdminService.getResourceByIdReq(params, __this, (res) => {
            if (res && res.success == 1) {
              __this.resourceFormData = res.rows && res.rows[0] ? res.rows[0] : {};
              // 改变数据的结构
              let rel = this.appAdminService.changeDropDownData(this.modalResourceListData, [], row.data.id);
              if (this)

                this.dropDownTree = rel[0].children;

              if (this.searchValue && !$.isEmptyObject(this.searchValue)) {
                // 在搜索时候，编辑弹窗的父级名字和id
                if (this.resourceReturndData[0].attributes.parentId == this.modalResourceListData[0].id) {
                  // 根节点是父级
                  this.resourceFormData.parentName = '无';
                  this.resourceFormData.parentId = 'nothing';
                } else {
                  // 根节点不是父级时
                  this.getParentName(this.modalResourceListData, this.resourceReturndData[0].attributes.parentId);
                }
              } else {
                // 不是搜索
                if (!row.parent) {
                  // 根节点是父级
                  this.resourceFormData.parentName = '无';
                  this.resourceFormData.parentId = 'nothing';
                } else {
                  this.resourceFormData.parentName = row.parent.data.resourceName;
                  this.resourceFormData.parentId = row.parent.data.id;
                }
              }
              this.dropDownTree.unshift({
                label: '无',
                parent: undefined,
                children: [],
                id: 'nothing'
              })
            }
          })
        } else if (modalCategory == 'view') {
          // 查看弹窗
          this.getParentName(this.modalResourceListData, this.resourceReturndData[0].attributes.parentId);
          if (!row.parent) {
            this.resourceFormData.parent = {
              data: {
                resourceName: this.resourceFormData.parentName
              }
            }
          }
        }
      }
    })
  }

  /**
   * 获取当前编辑节点的腹肌
   * @param arr 遍历的层级树数据
   * @param parentId 父级id
   */
  getParentName(arr, parentId) {
    for (let item of arr) {
      if (item.id == parentId) {
        this.resourceFormData.parentName = item.text;
        return;
      }
      if (item.children && item.children.length > 0) {
        this.getParentName(item.children, parentId);
      }
    }
  }



  /**
   * 父级下拉框  点击事件
   * 控制下拉框显隐
   * @param {*} ele
   * @memberof DataResourceComponent
   */
  drop(ele: any) {
    if (ele.style.display == 'inline-block') {
      ele.style.display = 'none';
    } else {
      ele.style.display = 'inline-block';
      this.addModalEnterEvent();
    }
  };


  /**
   * 选中下拉框的节点
   *
   * @param {any} event
   * @param {any} dropdowntree
   * @memberof DataResourceComponent
   */
  dropDownSelect(event, dropdowntree) {
    this.resourceFormData.parentName = this.selectedFile.label;
    this.resourceFormData.parentId = this.selectedFile.id;
    dropdowntree.style.display = "none";
  }

  /**
   * 弹窗 消失
   *
   * @memberof ResourceAdminComponent
   */
  modalHide() {
    this.modal.hide();
    this.selectedTreeTable = {};
  }

  /**
   * 判断表单中的名称是否重复
   *
   * @param {any} validEle
   * @memberof ResourceAdminComponent
   */
  public codeExistMes: any = false; // 资源code是否存在的信息
  nameIsExist(validEle) {
    // 如果输入的内容不符合规则，返回，不继续进行验证
    this.codeExistMes = false;
    if (validEle.errors) return;
    let body = {
      appId: this.appInfo.appId
    };
    body[validEle.name] = validEle.value;
    let __this = this;
    this.appAdminService.verifyCode(body, __this, (res) => {
      if (res && res.success == 1) {
        if (res.rows[0].booleanResult) {
          // 数据 code 已经存在
          this.codeExistMes = true;
        } else {
          // 数据 code  没有重复
          this.codeExistMes = false;
        }
      }
    })
  }


  /**
   * 搜索
   *
   * @memberof ResourceAdminComponent
   */
  search() {
    // 获取列表数据
    this.getResourceListData('search');
  }

  /**
   * 删除资源
   *
   * 先判断是否有关联功能，有提示。没有提示，确认删除
   * @param {any} row
   * @memberof DataResourceComponent
   * */
  delete(row) {
    let _that = this;
    if (row.children && row.children.length > 0) {
      this.commonService.growl(_that, 'error', '该节点存在子节点，请先删除子节点');
      return;
    }
    let body = {
      'objectId': row.data.id,
      appId: this.appInfo.appId
    };
    let message;
    // 查询资源是否关联功能
    this.appAdminService.confirmConnectFuncResourceReq(body, _that, (res) => {
      if (res && res.success && res.success == 1) {
        if (res.rows && res.rows[0].booleanResult) {
          // 有关联功能资源
          message = '该数据已关联功能资源，是否确定删除该数据资源？';
        } else {
          // 没有关联功能资源
          message = '确定要删除该数据资源？';
        }
        this.confirmationService.confirm({
          message: message,
          accept: () => {
            this.deletResource(row);
          }
        })

      }
    })
  }


  // 删除资源请求
  deletResource(row) {
    let _that = this;
    let delectNodeId = row.data.id;
    let body;
    this.successMsg = [];
    // 如果删除的节点含有子节点，则传父节点和所以子节点的Id,用逗号隔开
    if (row.children && row.children.length > 0) {
      delectNodeId = delectNodeId + ',' + this.getDelectNodeChildrenId(row);
    }
    body = {
      'objectId': delectNodeId
    };
    this.appAdminService.deleteResourceReq(body, _that, (res) => {
      if (res.success == 1) {
        this.successMsg.push({ severity: 'success', summary: '', detail: '数据资源删除成功' });
        _that.commonService.growl(_that, 'success', '', this.successMsg);
        this.selectedTreeTable = {};
        // 调取列表数据
        this.selectName = '资源名称';
        this.searchValue = '';
        _that.getResourceListData();
      } else if (res.success == -1) {
        _that.commonService.growl(_that, 'error', res.msg);
      }
    })

  }

  /**
   * 获取删除节点的  所有子节点id
   *
   * @param {any} row 删除节点的数据
   * @returns 所有子节点的id值，以逗号隔开
   * @memberof DataResourceComponent
   */
  getDelectNodeChildrenId(row) {
    let value = '';
    for (let item of row.children) {
      value = value + ',' + item.data.id;
      if (item.children && item.children.length > 0) {
        this.getDelectNodeChildrenId(item);
      }
    }
    return value.slice(1)
  }



  /**
   * 处理  数据 资源树 数据
   *
   * @param {*} array
   * @memberof DataResourceComponent
   */
  changeData(arr: any, resultValue: any) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let resourceName = item['text'];
      let children = item['children'];
      let attr = item['attributes'];
      let id = item['id'];
      if (children) {
        let data = {
          'data': {
            hierarchy: attr.hierarchy,
            resourceCode: attr.resourceCode,
            resourceName: resourceName,
            description: attr.description,
            remark: attr.remark,
            createTime: attr.createTime,
            createUser: attr.createUser,
            checked: item['checked'],
            state: item['state'],
            active: attr.active,
            id: id
          },
          'attributes': attr,
          'children': [],
          'expanded': true,
        }
        resultValue[i] = data;
        if (children.length >= 1) {
          this.changeData(children, resultValue[i].children);
        }
      }
    }
    return resultValue;
  };


}
