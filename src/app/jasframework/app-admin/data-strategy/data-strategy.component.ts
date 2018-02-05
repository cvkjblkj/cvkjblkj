import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-strategy',
  templateUrl: './data-strategy.component.html',
  styleUrls: ['./data-strategy.component.scss']
})
export class DataStrategyComponent implements OnInit {
  // 应用   需要的变量
  public appInfo: Object; // 应用的信息（应用名称、应用code、应用id）
  public menuId = this.route.snapshot.queryParams['id'];
  dataRule = true;
  constructor(
    public router: Router,
    public route: ActivatedRoute
  ) {     // 从本地存储中获取应用的信息
    this.appInfo = JSON.parse(window.localStorage['appObj']);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      if (this.dataRule) {
        this.router.navigate(['/jas/app-admin/data-strategy'], { queryParams: { 'name': 'rule', 'id': this.menuId }, })
      } else {
        this.router.navigate(['/jas/app-admin/data-strategy'], { queryParams: { 'name': 'strategy', 'id': this.menuId }, })
      }
    })
  }
  goRuleData() {
    this.dataRule = true;
    this.router.navigate(['/jas/app-admin/data-strategy'], { queryParams: { 'name': 'rule', 'id': this.menuId }, })
  }

  goRuleStrategy() {
    this.dataRule = false;
    this.router.navigate(['/jas/app-admin/data-strategy'], { queryParams: { 'name': 'strategy', 'id': this.menuId }, })
  }




  
}
