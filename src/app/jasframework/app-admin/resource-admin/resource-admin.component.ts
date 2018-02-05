

import { AppAdminService } from './../shared/app-admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

declare var $: any; // 引入juqery
@Component({
  selector: 'app-resource-admin',
  templateUrl: './resource-admin.component.html',
  styleUrls: ['./resource-admin.component.scss'],
  providers: [AppAdminService]
})
export class ResourceAdminComponent implements OnInit {
  // 应用   需要的变量
  public appInfo: Object; // 应用的信息（应用名称、应用code、应用id）
  public appFuncDafault = true;
  public menuId = this.route.snapshot.queryParams['id'];
  constructor(
    public router: Router,
    public route: ActivatedRoute
  ) {
    // 从本地存储中获取应用的信息
    this.appInfo = JSON.parse(window.localStorage['appObj']);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      if (this.appFuncDafault) {
        this.router.navigate(['/jas/app-admin/resource-admin'], { queryParams: { 'name': 'func', 'id': this.menuId }, })
      } else {
        this.router.navigate(['/jas/app-admin/resource-admin'], { queryParams: { 'name': 'data', 'id': this.menuId }, })
      }
    })
  }
  goAppFunc(name) {
    this.appFuncDafault = name == 'appFunc' ? true : false;
    this.router.navigate(['/jas/app-admin/resource-admin'], { queryParams: { 'name': name == 'appFunc' ? 'func' : 'data', 'id': this.menuId }, })
  }

  configBtn(e) {
    this.appFuncDafault = false;
  }

}
