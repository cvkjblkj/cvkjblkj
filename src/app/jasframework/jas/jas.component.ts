import { ActivatedRoute, Params } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { ViewChild, AfterViewInit, OnChanges, Input } from '@angular/core';
import { JasService } from './shared/jas.service';
import { Component, OnInit } from '@angular/core';
import { JasCommunicationsService } from './shared/jas.commumication.service';

@Component({
  selector: 'app-jas',
  templateUrl: './jas.component.html',
  styleUrls: ['./jas.component.css'],
  providers: [JasService, JasCommunicationsService]
})
export class JasComponent implements OnInit, AfterViewInit, OnChanges {
  public contentMsg: any = ''; //无法得到数据时的报错信息
  constructor(public jasService: JasService,
    public route: ActivatedRoute,
    public jasCommunicationService: JasCommunicationsService
  ) {

  }

  @ViewChild('confirmModal') public confirmModal: ModalDirective;
  public isCollapse: Boolean = true;  //定义内容区域菜单 是否收缩
  public navBar: any = {};  //内容区域菜单的 值
  public menuData: any;//菜单的数据存储
  ngOnChanges() {

  }
  ngOnInit() {




    this.route.queryParams
      // (+) converts string 'id' to a number
      .subscribe((params: Params) => {
        if (params['IsRequest']) {
          this.jasService.getMenu(params['id']).subscribe(
            res => {
              if (res['success'] == 1) {
                this.navBar = {
                  'title': res.rows[0].text,
                  'id': res.rows[0].id,
                  'children': res.rows[0].children
                };
                this.menuData = this.navBar;
                // console.log('jas----------------');
                // console.log(this.menuData);
                window.localStorage.setItem('menu', JSON.stringify(this.navBar));
              } else {
                if (res['code'] == 400) {
                  this.contentMsg = res['msg'];

                }
              }
            }
          )
        } else if (!params['IsRequest']) {
          // console.log(object);
          // console.log('not requeset');
          // this.navBar = JSON.parse(window.localStorage.getItem('menu'));
        }

      })
  }
  ngAfterViewInit() {
  }



  // 布局
  public collapseProductNavbar() {
    if (this.isCollapse) {
      this.isCollapse = false;
    } else if (!this.isCollapse) {
      this.isCollapse = true;
    }
    //发送订阅消息
    this.jasCommunicationService.sendMessage('second-level menu change')

  }
}
