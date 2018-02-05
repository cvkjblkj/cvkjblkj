import { ActivatedRoute } from '@angular/router';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { INCONFIG } from './../../../core/global';
import { CommonService } from './../../../core/common-service/common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-privilege-demo',
  templateUrl: './data-privilege-demo.component.html',
  styleUrls: ['./data-privilege-demo.component.scss'],
  providers: [CommonService, CommonRequestService]
})
export class DataPrivilegeDemoComponent implements OnInit {
  public userList = [];
  public fileServerSrc = INCONFIG.fileServerSrc;
  public dataServerSrc = INCONFIG.dataServerSrc;
  public roleNames = window.localStorage['loginRolesName'];
  // 当列表没有数据时显示
  public emptyMessage = "未查到相关数据";
  constructor(
    public commonService: CommonService,
    public commonRequestMethodService: CommonRequestMethodService,
    public commonRequestService: CommonRequestService,
    public router: ActivatedRoute
  ) { }

  ngOnInit() {

    // let funcId = '8300840a-dbbb-406e-a9b4-7220338eb70d';
    this.getBtn();
  }

  /**
   * 获取按钮集合的值
   * 
   * @memberof DataResourceComponent
  * */
  public getBtn() {
    let _that = this;
    let menuId = this.router.snapshot.queryParams['id'] ? this.router.snapshot.queryParams['id'] : this.router.snapshot.params['id'];
    let params = {
      'parentId': menuId,
      'viewTypeCode': INCONFIG.viewTypeCode,
      'appCode': INCONFIG.appCode,
    }
    let url = this.dataServerSrc + '/app/view/getTreeByLoginUser';
    this.commonRequestMethodService.doGet(url, params, _that, (res) => {
      if (res.success && res.success == 1) {
        let funcId = this.getFuncId(res.rows, 'TestUserManager');
        this.getUserList(funcId);
      }

    })

  };

  /**
   * 获取当前菜单的funcId
   */
  getFuncId(arr, funcCode) {
    for (let item of arr) {
      if (item.attributes.funcCode == funcCode) {
        return item.attributes.funcId;
      }
      if (item.children && item.children.length > 0) {
        this.getFuncId(item.children, funcCode)
      }
    }
  }
  /**
   * 获取用户列表
   * @param funcId 
   */
  getUserList(funcId) {
    let _that = this;
    let url = this.dataServerSrc + '/testUser/queryList';
    let params = {
      'requestFuncId': funcId,
    };
    this.commonRequestMethodService.doGet(url, params, _that, (res) => {
      if (res.success == 1) {
        _that.userList = res['rows'];
        _that.statusPipe(_that.userList);
        // 显示刷新成功
        _that.commonService.growl(_that, 'success', '用户刷新成功');
      }
    });
  }


  /**
  * 用户状态输出值改变
  */
  public statusPipe(data: any) {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      switch (item['status']) {
        case -3:
          item['status'] = '已退出';
          break;
        case -2:
          item['status'] = '移除';
          break;
        case -1:
          item['status'] = "冻结";
          break;
        case 0:
          item['status'] = "未激活";
          break;
        case 1:
          item['status'] = "已激活";
      }
    }
  }

}
