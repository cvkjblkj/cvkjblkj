import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { IActionMapping, KEYS, TREE_ACTIONS, TreeNode } from 'angular2-tree-component';

import { UserAdmin } from '../shared/user-admin.model';
import { UserAdminService } from '../shared/user-admin.service'

@Component({
  selector: 'jas-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
  providers: [UserAdminService]
})

export class OrganizationComponent implements OnInit {

  @Input() idData: any; //获取的企业id和应用id

  private enterpriselist: UserAdmin;
  private treeList: any;
  private selectedId: string;
  private userlist: any;
  public selectedEnterprise: any; // 选中的企业名称

  @Output() onSelectedId = new EventEmitter();

  constructor(
    public userAdminService: UserAdminService
  ) { }

  //初始化页面
  ngOnInit() {
    // this.getOrgTree()
    // this.userAdminService.getEnterpriseList()
    //   .then(res => {
    //     let returnList = JSON.parse(res['_body']);
    //     //获取企业列表
    //     this.enterpriselist = returnList['rows'];
    //     this.changeDropDownList(this.enterpriselist);
    //     this.selectedEnterprise = this.enterpriselist[0]['enterpriseName'];
    //     let firstId = this.enterpriselist[0]['objectId'];
    //     // 存储企业id值
    //     window.localStorage['enterpriseId'] = firstId;
    //     //获取组织机构树数据
    //     setTimeout(() => {
    //       this.userAdminService.getFirstTree(firstId)
    //         .then(trees => {
    //           this.treeList = trees['rows'];
    //           if (this.treeList['length'] == 0) {
    //             let rootNodeId = '';
    //             this.onSelectedId.emit(rootNodeId);
    //           } else {
    //             // 获取初始化节点 id值 初始化数据
    //             let rootNodeId = this.treeList[0]['id'];
    //             this.onSelectedId.emit(rootNodeId);
    //           }
    //         })
    //     }, 500)
    //   });
  }
  /**
  //  * 获取当前企业应用下的组织机构
  //  */
  // public getOrgTree() {
  //   let enterpriseId = '';
  //   let parentId = '';
  //   this.userAdminService.getTree(enterpriseId, parentId).then(
  //     res => {
  //       if (res['success'] == 1) {
  //         this.treeList = res['rows'];
  //         // 顶级节点的id值
  //         this.onSelectedId.emit(this.treeList[0]['id']);
  //       } else if (res['success'] == -1) {
  //         this.onSelectedId.emit('null');
  //       }


  //     }
  //   )
  // }

  // //点击公司名称时，获取对应组织机构树
  // getValue(selected: any) {
  //   // 获取组织机构树
  //   window.localStorage['enterpriseId'] = selected;
  //   let enterpriseId = '';
  //   let parentId = '';
  //   this.userAdminService.getTree(enterpriseId, parentId)
  //     .then(trees => {
  //       this.treeList = trees['rows'];
  //       this.onSelectedId.emit(this.treeList[0]['id'])
  //     })
  // }
  // /**
  //    * 改变企业列表的数据结构   dropdown
  //    */
  // public lists: any;
  // changeDropDownList(arr: any) {
  //   this.lists = [];
  //   for (var i = 0; i < arr.length; i++) {
  //     this.lists.push({ label: arr[i].enterpriseName, value: arr[i] });
  //   }
  // }

  // 定义组织机构树的mouse事件
  // actionMapping: IActionMapping = {
  //   mouse: {
  //     contextMenu: (tree, node, $event) => {
  //       $event.preventDefault();
  //     },
  //     dblClick: (tree, node, $event) => {
  //       if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
  //     },
  //     click: (tree, node, $event) => {
  //       $event.shiftKey
  //         ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
  //         : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event)
  //       //获取当前点击的id值
  //       let id = node.data.id;
  //       this.onSelectedId.emit(id);
  //     }
  //   },
  // };
  /**
   * 选中节点
   * @param event 选中节点的信息
   */
  public selectNode($event) {
    let orgId = $event.node.data.id;
    this.onSelectedId.emit(orgId)
  }

  // 配置组织机构树的参数
  options = {
    // allowDrag: true,
    displayField: 'text',
    // actionMapping: this.actionMapping,
  }


}
